const crypto = require('crypto');
const db = require('../db/index')

exports.organisationRoutes = (app) => {
    app.post('/organisation', async (req, res) => {
        let response;

        try {
            const query1 = {
                text: 'INSERT INTO organisations (company_name, email, bio, location, wallet_address, industry) VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
                values: [req.body.company_name, req.body.email, req.body.bio, req.body.location, req.body.wallet_address, req.body.industry]
            }
            const result = await db.query(query1)

            hash = crypto.createHash("sha256");
            hash.update(result.rows[0].id.toString());
            const id_hash = hash.digest("hex");

            const query2 = {
                text: "UPDATE organisations SET content_hash = $1 WHERE id = $2",
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
    })

    app.get('/organisation/query/:query', async (req, res) => {
        let response;
        try {
            const query = {
                text: `SELECT company_name, wallet_address FROM organisations WHERE company_name ILIKE $1`,
                values: [`${req.params.query}%`]
            }
            const result = await db.query(query)
            response = {
                success: true,
                orgs: result.rows
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

    app.get('/organisation/:hash', async (req, res) => {
        let response;
        try {
            const query = {
                text: "SELECT * FROM organisations WHERE content_hash = $1",
                values: [req.params.hash]
            }
            const result = await db.query(query)

            response = {
                success: true,
                organisation: result.rows[0]
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

    app.get('/organisations/:hash', async (req, res) => {
        let response;
        try {
            const hashArray = JSON.parse(req.params.hash)
            const query = {
                text: "SELECT * FROM organisations WHERE content_hash = ANY ($1)",
                values: [hashArray]
            }
            const result = await db.query(query)
            response = {
                success: true,
                users: result.rows
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

    app.delete('/organisation/:hash', async (req, res) => {
        let response;
        try {
            const query = {
                text: "DELETE FROM organisations WHERE content_hash = $1",
                values: [req.params.hash]
            }
            await db.query(query)
            response = {
                success: true,
                message: `Organisation of hash ${req.params.hash} deleted!`
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

    app.put('/organisation', async (req, res) => {
        let response;
        try {
            const query = {
                text: "UPDATE organisations SET company_name = $1, email = $2, location = $3, industry = $4 WHERE content_hash = $5 RETURNING content_hash",
                values: [req.body.company_name, req.body.email, req.body.location, req.body.industry, req.body.content_hash] 
            }
            const result = await db.query(query)
            response = {
                success: true,
                message: `Organisation of hash ${result.rows[0].content_hash} updated!`
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

    app.put('/organisation/about', async (req, res) => {
        let response;
        try {
            const query = {
                text: "UPDATE organisations SET bio = $1 WHERE wallet_address = $2 RETURNING wallet_address",
                values: [req.body.about, req.body.wallet_address]
            }
            const result = await db.query(query)
            response = {
                success: true,
                message: `About of Organisation of address ${result.rows[0].wallet_address} updated!`
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