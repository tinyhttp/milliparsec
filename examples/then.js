import { createServer } from 'http'
import { json } from '../lib/body-parsec'

createServer((req, res) => {
  json(req).then(data => {
    res.setHeader('Content-Type', 'application/json')
    res.end(req.body.hello)
    console.log(data) // { "hello": "world" }
  })
}).listen(80)
