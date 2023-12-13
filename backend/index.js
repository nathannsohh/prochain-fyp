const express = require('express')
const cors = require('cors')
const User = require('./routes/user.js')


const app = express()
app.use(express.json())
app.use(cors())

const port = 8000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

User.userRoutes(app)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})