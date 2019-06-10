import { createServer } from 'http'
import { raw } from '../lib/body-parsec'

createServer(async (req, res) => {
  res.setHeader('Content-Type', 'text/html')
  if (req.url === '/') {
    res.end('<form method="POST" action="/login"><input name="name" /></form>')
  } else {
    await raw(req)
    res.end(`Hi ${req.body.name}!`)
  }
}).listen(80)
