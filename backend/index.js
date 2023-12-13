const express = require('express')
const User = require('./routes/user.js')


const app = express()
app.use(express.json())

const port = 8000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

User.userRoutes(app)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})