// @ts-check

import bodyParser from 'body-parser'
import { createServer } from 'node:http'

const mw = bodyParser.json()

const server = createServer((req, res) => {
  mw(req, res, () => {
    // @ts-expect-error added by body parser
    res.end(JSON.stringify(req.body))
  })
})

server.listen(3002)
