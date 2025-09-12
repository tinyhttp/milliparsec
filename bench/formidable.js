// @ts-check

import { createReadStream } from 'node:fs'
import { createServer } from 'node:http'
import formidable from 'formidable'

const form = formidable({})

const server = createServer((req, res) => {
  form.parse(req, (_, _fields, files) => {
    // @ts-expect-error the file is guaaranteed in payload
    const file = createReadStream(files.file[0].filepath)
    file.pipe(res)
  })
})

server.listen(3005)
