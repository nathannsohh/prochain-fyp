const express = require('express')
const cors = require('cors')

const User = require('./routes/user.js')
const Post = require('./routes/post.js')
const Comment = require('./routes/comments.js')

const app = express()
app.use(express.json())
app.use(cors())

const port = 8000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

User.userRoutes(app)
Post.postRoutes(app)
Comment.commentRoutes(app)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})