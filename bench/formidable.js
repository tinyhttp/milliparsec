// @ts-check
import { createServer } from 'node:http'
import formidable from 'formidable'
import { createReadStream } from 'node:fs'

const form = formidable({})

const server = createServer((req, res) => {
  form.parse(req, (_, __, files) => {
    // @ts-expect-error this is JS
    const file = createReadStream(files.file[0].filepath)

    file.pipe(res)
  })
})

server.listen(3005)