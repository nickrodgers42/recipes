const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const apiV1 = require('./api-v1')

const port = process.env.PORT || 4000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('/v1', apiV1)

app.get('/', (req, res) => {
  res.send('Hello world')
})

app.listen(port, () => {
  console.log('API listening on port ' + port)
})
