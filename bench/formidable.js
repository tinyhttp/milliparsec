import { createReadStream } from 'node:fs'
// @ts-check
import { createServer } from 'node:http'
import formidable from 'formidable'

const form = formidable({})

const server = createServer((req, res) => {
  form.parse(req, (_, fields, files) => {
    // @ts-expect-error this is JS
    const file = createReadStream(files.file[0].filepath)
    file.pipe(res)
  })
})

server.listen(3005)
