const crypto = require('crypto');
const db = require('../db/index');

exports.jobExperienceRoutes = (app) => {
    app.post('/experience', async (req, res) => {
        let response;
        try {
            const query1 = {
                text: `INSERT INTO experiences ("start", "end", title, about, type, company_name) VALUES($1, $2, $3, $4, $5, $6) returning id`,
                values: [req.body.start, req.body.end, req.body.title, req.body.about, req.body.type, req.body.company_name]
            }
            const result = await db.query(query1)

            hash = crypto.createHash("sha256");
            hash.update(result.rows[0].id.toString());
            const id_hash = hash.digest("hex");

            const query2 = {
                text: "UPDATE experiences SET content_hash = $1 WHERE id = $2",
                values: [id_hash, result.rows[0].id]
            }
            await db.query(query2)

            response = {
                success: true,
                hash: id_hash
            }
            res.status(200).send(response)
        } catch (e) {
            response = {
                success: false,
                message: e.message
            }
            res.status(400).send(response)
        }
    }),

    app.get('/experience/:hash', async (req, res) => {
        let response;
        try {
            const hashArray = JSON.parse(req.params.hash)
            const query = {
                text: `SELECT to_char("start", 'YYYY-MM') as "start", to_char("end", 'YYYY-MM') as "end", title, about, id, content_hash, type, company_name FROM experiences WHERE content_hash = ANY ($1)`,
                values: [hashArray]
            }
            const result = await db.query(query)

            response = {
                success: true,
                experiences: result.rows
            }
            res.status(200).send(response)
        } catch (e) {
            response = {
                success: false,
                message: e.message
            }
            res.status(400).send(response)
        }
    }),

    app.put('/experience', async (req, res) => {
        let response;
        try {
            const query = {
                text: `UPDATE experiences SET "start" = $1, "end" = $2, title = $3, about = $4, type = $5, company_name = $6 WHERE content_hash = $7 returning content_hash`,
                values: [req.body.start, req.body.end, req.body.title, req.body.about, req.body.type, req.body.company_name, req.body.hash]
            }
            const result = await db.query(query)
            response = {
                success: true,
                message: `Experience ${result.rows[0].content_hash} updated!`
            }
            res.status(200).send(response)
        } catch (e) {
            response = {
                success: false,
                message: e.message
            }
            res.status(400).send(response)
        }
    })

    app.delete('/experience/:hash', async (req, res) => {
        let response;
        try {
            const query = {
                text: "DELETE FROM experiences WHERE content_hash = $1",
                values: [req.params.hash]
            }
            await db.query(query)
            response = {
                success: true,
                message: `Comment ${req.params.hash} deleted!`
            }
            res.status(200).send(response)
        } catch (e) {
            response = {
                success: false,
                message: e.message
            }
            res.status(400).send(response)
        }
    })
}