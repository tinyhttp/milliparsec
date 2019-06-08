const { createServer } = require('http')
const parsec = require('../dist/parsec')

createServer(async (req, res) => {
  res.setHeader('Content-Type', 'text/html')
  if (req.url === '/') {
    res.end('<form method="POST" action="/login"><input name="name" /></form>')
  } else {
    await parsec.raw(req)
    res.end(`Hi ${req.body.name}!`)
  }
}).listen(80)
