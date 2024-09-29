// @ts-check

import { createServer } from 'node:http'
import * as bodyParser from '../dist/index.js'
const mw = bodyParser.multipart()

const server = createServer((req, res) => {
  mw(req, res, () => {
    /**
     * @type {File}
     */
    // @ts-ignore
    const file = req.body.file

    const stream = file.stream()

    res.writeHead(200, {
      'Content-Type': file.type,
      'Content-Disposition': `attachment; filename="${file.name}"`
    })

    // Pipe the stream to the response
    stream.pipeTo(
      new WritableStream({
        write(chunk) {
          res.write(chunk)
        },
        close() {
          res.end()
        },
        abort(err) {
          console.error('Stream error:', err)
          res.writeHead(500)
          res.end('Error streaming file')
        }
      })
    )
  })
})

server.listen(3004)
