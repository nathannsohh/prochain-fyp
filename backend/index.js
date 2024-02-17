const express = require('express')
const cors = require('cors')

const User = require('./routes/user.js')
const Post = require('./routes/post.js')
const Comment = require('./routes/comments.js')
const Organisation = require('./routes/organisations.js')
const Job = require('./routes/jobs.js')

const app = express()
app.use(express.json())
app.use(cors())

const port = 8002

app.get('/', (req, res) => {
  res.send('Hello World!')
})

User.userRoutes(app)
Post.postRoutes(app)
Comment.commentRoutes(app)
Organisation.organisationRoutes(app)
Job.jobsRoutes(app)

app.listen(port, () => {
  console.log(`ProChain server listening on port ${port}`)
})