const crypto = require('crypto');
const db = require('../db/index')

exports.jobsRoutes = (app) => {
    app.post('/jobs', async (req, res) => {
        let response;
        try {
            const query1 = {
                text: "INSERT INTO jobs (job_title, location, time_posted, employment_type, job_level, job_description) VALUES($1, $2, NOW()::timestamp, $3, $4, $5) returning id",
                values: [req.body.job_title, req.body.location, req.body.employment_type, req.body.job_level, req.body.job_description]
            }
            const result = await db.query(query1)

            hash = crypto.createHash("sha256");
            hash.update(result.rows[0].id.toString());
            const id_hash = hash.digest("hex");

            const query2 = {
                text: "UPDATE jobs SET content_hash = $1 WHERE id = $2",
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

    app.get('/jobs/:hash', async (req, res) => {
        let response;
        try {
            const hashArray = JSON.parse(req.params.hash)
            const query = {
                text: "SELECT * FROM jobs WHERE content_hash = ANY ($1)",
                values: [hashArray]
            }
            const result = await db.query(query)

            response = {
                success: true,
                jobs: result.rows
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

    app.put('/jobs', async (req, res) => {
        let response;
        try {
            const query = {
                text: "UPDATE jobs SET job_title = $1, location = $2, employment_type = $3, job_level = $4, job_description = $5 WHERE content_hash = $6 returning content_hash",
                values: [req.body.job_title, req.body.location, req.body.employment_type, req.body.job_level, req.body.job_description, req.body.hash]
            }
            const result = await db.query(query)
            response = {
                success: true,
                message: `Job ${result.rows[0].content_hash} updated!`
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

    app.delete('/jobs/:hash', async (req, res) => {
        let response;
        try {
            const query = {
                text: "DELETE FROM jobs WHERE content_hash = $1",
                values: [req.params.hash]
            }
            await db.query(query)
            response = {
                success: true,
                message: `Job ${req.params.hash} deleted!`
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