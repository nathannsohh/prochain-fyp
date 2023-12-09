const express = require('express')
var BeeJs = require("@ethersphere/bee-js");

const app = express()
const port = 8000

const bee = new BeeJs.Bee('http://localhost:1633');
const beeDebug = new BeeJs.BeeDebug("http://localhost:1635");


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/bee', async (req, res) => {
  const postageBatchId = await beeDebug.createPostageBatch("10000", 17);
  const result = await bee.uploadData(postageBatchId, "Hello!");

  console.log(result.reference);

  const retrievedData = await bee.downloadData(result.reference);

  res.send(retrievedData.text());
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})