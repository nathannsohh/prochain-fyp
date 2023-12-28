const db = require('../db/index')
exports.commentRoutes = (app) => {
    app.post('/comment', async (req, res) => {
        let response;
        try {
            const query = {
                text: "INSERT INTO comments (content) VALUES($1) returning id",
                values: [req.body.content]
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
    }),

    app.get('/comment/:id', async (req, res) => {
        let response;
        try {
            const idArray = JSON.parse(req.params.id)
            const query = {
                text: "SELECT * FROM comments WHERE id = ANY ($1)",
                values: [idArray]
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
                text: "UPDATE comments SET content = $1 WHERE id = $2 returning id",
                values: [req.body.content, req.body.id]
            }
            const result = await db.query(query)
            response = {
                success: true,
                message: `Post ${result.rows[0].id} updated!`
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