const db = require('../db/index')

exports.educationRoutes = (app) => {
    app.post('/education', async (req, res) => {
        let response;
        try {
            const query = {
                text: 'INSERT INTO education (user_address, school_name, "start", "end", type, field, about, verifiable) VALUES($1, $2, $3, $4, $5, $6, $7, $8) returning id',
                values: [req.body.user_address, req.body.school_name, req.body.start, req.body.end, req.body.type, req.body.field, req.body.about, req.body.verifiable]
            }
            const result = await db.query(query)

            response = {
                success: true,
                message: `Education with id ${result.rows[0].id}`
            }
            res.status(200).send(response)
        } catch (e) {
            response = {
                success: false,
                message: e.message
            }
            console.log(e.message)
            res.status(400).send(response)
        }
    }),

    app.get('/education/:userAddress', async (req, res) => {
        let response;
        try {
            const query = {
                text: `SELECT id, school_name, type, field, to_char("start", 'YYYY-MM') as "start", to_char("end", 'YYYY-MM') as "end", about, verifiable, user_address FROM education WHERE user_address = $1`,
                values: [req.params.userAddress]
            }
            const result = await db.query(query)

            response = {
                success: true,
                education: result.rows
            }
            res.status(200).send(response)
        } catch (e) {
            response = {
                success: false,
                message: e.message
            }
            console.log(e.message)
            res.status(400).send(response)
        }
    }),

    app.put('/education', async (req, res) => {
        let response;
        try {
            const query = {
                text: 'UPDATE education SET school_name = $1, "start" = $2, "end" = $3, type = $4, about = $5, verifiable = $6, field = $7 WHERE id = $8 returning id',
                values: [req.body.school_name, req.body.start, req.body.end, req.body.type, req.body.about, req.body.verifiable, req.body.field, req.body.id]
            }
            const result = await db.query(query)
            response = {
                success: true,
                message: `Education ${result.rows[0].id} updated!`
            }
            res.status(200).send(response)
        } catch (e) {
            response = {
                success: false,
                message: e.message
            }
            console.log(e.message)
            res.status(400).send(response)
        }
    })

    app.delete('/education/:id', async (req, res) => {
        let response;
        try {
            const query = {
                text: "DELETE FROM education WHERE id = $1",
                values: [req.params.id]
            }
            await db.query(query)
            response = {
                success: true,
                message: `Education ${req.params.hash} deleted!`
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