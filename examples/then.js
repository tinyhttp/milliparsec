const { createServer } = require('http')
const parsec = require('../dist/body-parsec')

createServer((req, res) => {
  parsec.json(req).then(data => {
    res.setHeader('Content-Type', 'application/json')
    res.end(req.body.hello)
    console.log(data)
  })
}).listen(80)
