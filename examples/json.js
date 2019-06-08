const { createServer } = require('http')
const parsec = require('../lib/body-parsec')

createServer(async (req, res) => {
  await parsec.json(req)
  res.setHeader('Content-Type', 'application/json')
  res.end(req.body.hello)
}).listen(80)
