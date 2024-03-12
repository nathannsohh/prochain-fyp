const crypto = require('crypto');
const db = require('../db/index')

exports.userRoutes = (app) => {
    app.post('/user', async (req, res) => {
        let response;

        try {
            const query1 = {
                text: 'INSERT INTO users (first_name, last_name, email, pronouns, bio, location, wallet_address) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
                values: [req.body.first_name, req.body.last_name, req.body.email, req.body.pronouns, req.body.bio, req.body.location, req.body.walletAddress]
            }
            const result = await db.query(query1)

            hash = crypto.createHash("sha256");
            hash.update(result.rows[0].id.toString());
            const id_hash = hash.digest("hex");

            const query2 = {
                text: "UPDATE users SET content_hash = $1 WHERE id = $2",
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

    app.get('/user/:hash', async (req, res) => {
        let response;
        try {
            const query = {
                text: "SELECT * FROM users WHERE content_hash = $1",
                values: [req.params.hash]
            }
            const result = await db.query(query)

            response = {
                success: true,
                user: result.rows[0]
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

    app.get('/users/:hash', async (req, res) => {
        let response;
        try {
            const hashArray = JSON.parse(req.params.hash)
            const query = {
                text: "SELECT * FROM users WHERE content_hash = ANY ($1)",
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

    app.delete('/user/:hash', async (req, res) => {
        let response;
        try {
            const query = {
                text: "DELETE FROM users WHERE content_hash = $1",
                values: [req.params.hash]
            }
            await db.query(query)
            response = {
                success: true,
                message: `User of hash ${req.params.hash} deleted!`
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

    app.put('/user', async (req, res) => {
        let response;
        try {
            const query = {
                text: "UPDATE users SET first_name = $1, last_name = $2, email = $3, pronouns = $4, bio = $5, location = $6 WHERE content_hash = $7 RETURNING content_hash",
                values: [req.body.first_name, req.body.last_name, req.body.email, req.body.pronouns, req.body.bio, req.body.location, req.body.content_hash] 
            }
            const result = await db.query(query)
            response = {
                success: true,
                message: `User of hash ${result.rows[0].content_hash} updated!`
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

    app.put('/user/about', async (req, res) => {
        let response;
        try {
            const query = {
                text: "UPDATE users SET about = $1 WHERE wallet_address = $2 RETURNING wallet_address",
                values: [req.body.about, req.body.wallet_address]
            }
            const result = await db.query(query)
            response = {
                success: true,
                message: `About of User of address ${result.rows[0].wallet_address} updated!`
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