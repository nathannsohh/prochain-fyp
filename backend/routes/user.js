const db = require('../db/index')
exports.userRoutes = (app) => {
    app.post('/user', async (req, res) => {
        let response;

        try {
            const query = {
                text: 'INSERT INTO users (first_name, last_name, email, pronouns, bio, wallet_address) VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
                values: [req.body.firstName, req.body.lastName, req.body.email, req.body.pronouns, req.body.bio, req.body.walletAddress]
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
}