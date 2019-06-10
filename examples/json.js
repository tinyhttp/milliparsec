import { createServer } from 'http'
import { json } from '../lib/body-parsec'

createServer(async (req, res) => {
  await json(req)
  res.setHeader('Content-Type', 'application/json')
  res.end(req.body.hello)
}).listen(80)
