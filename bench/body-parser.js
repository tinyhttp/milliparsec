// @ts-check

import { createServer } from 'node:http'
import bodyParser from 'body-parser'

const mw = bodyParser.json()

const server = createServer((req, res) => {
  mw(req, res, () => {
    // @ts-expect-error added by body parser
    res.end(JSON.stringify(req.body))
  })
})

server.listen(3002)
