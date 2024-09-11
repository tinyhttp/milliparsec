// @ts-check

import { createServer } from 'node:http'
import * as bodyParser from '../dist/index.js'

const mw = bodyParser.json()

const server = createServer((req, res) => {
  mw(req, res, () => {
    // @ts-expect-error added by body parser
    res.end(JSON.stringify(req.body))
  })
})

server.listen(3003)
