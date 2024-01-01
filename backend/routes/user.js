const db = require('../db/index')
exports.userRoutes = (app) => {
    app.post('/user', async (req, res) => {
        let response;

        try {
            const query = {
                text: 'INSERT INTO users (first_name, last_name, email, pronouns, bio, location, wallet_address) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
                values: [req.body.first_name, req.body.last_name, req.body.email, req.body.pronouns, req.body.bio, req.body.location, req.body.walletAddress]
            }
            const result = await db.query(query)
            response = {
                success: true,
                hash: result.rows[0].id
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

    app.get('/user/:id', async (req, res) => {
        let response;
        try {
            const query = {
                text: "SELECT * FROM users WHERE id = $1",
                values: [req.params.id]
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

    app.delete('/user/:id', async (req, res) => {
        let response;
        try {
            const query = {
                text: "DELETE FROM users WHERE id = $1",
                values: [req.params.id]
            }
            await db.query(query)
            response = {
                success: true,
                message: `User of hash ${req.params.id} deleted!`
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
                text: "UPDATE users SET first_name = $1, last_name = $2, email = $3, pronouns = $4, bio = $5, location = $6 WHERE wallet_address = $7 RETURNING id",
                values: [req.body.first_name, req.body.last_name, req.body.email, req.body.pronouns, req.body.bio, req.body.location, req.body.wallet_address] 
            }
            const result = await db.query(query)
            response = {
                success: true,
                message: `User of hash ${result.rows[0].id} updated!`
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