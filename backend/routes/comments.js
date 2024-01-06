const crypto = require('crypto');
const db = require('../db/index');

exports.commentRoutes = (app) => {
    app.post('/comment', async (req, res) => {
        let response;
        try {
            const query1 = {
                text: "INSERT INTO comments (content, time_posted) VALUES($1, NOW()::timestamp) returning id",
                values: [req.body.content]
            }
            const result = await db.query(query1)

            hash = crypto.createHash("sha256");
            hash.update(result.rows[0].id.toString());
            const id_hash = hash.digest("hex");

            const query2 = {
                text: "UPDATE comments SET content_hash = $1 WHERE id = $2",
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

    app.get('/comment/:hash', async (req, res) => {
        let response;
        try {
            const hashArray = JSON.parse(req.params.hash)
            const query = {
                text: "SELECT * FROM comments WHERE content_hash = ANY ($1)",
                values: [hashArray]
            }
            const result = await db.query(query)

            response = {
                success: true,
                posts: result.rows
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

    app.put('/comment', async (req, res) => {
        let response;
        try {
            const query = {
                text: "UPDATE comments SET content = $1, edited = true WHERE content_hash = $2 returning content_hash",
                values: [req.body.content, req.body.hash]
            }
            const result = await db.query(query)
            response = {
                success: true,
                message: `Comment ${result.rows[0].content_hash} updated!`
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

    app.delete('/comment/:hash', async (req, res) => {
        let response;
        try {
            const query = {
                text: "DELETE FROM comments WHERE content_hash = $1",
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