import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import { File } from 'node:buffer'
import { createServer } from 'node:http'
import { describe, it } from 'node:test'
import { App } from '@tinyhttp/app'
import { makeFetch } from 'supertest-fetch'
import { type ReqWithBody, custom, json, multipart, raw, text, urlencoded } from './src/index.js'

const td = new TextDecoder()

describe('Basic parsing', () => {
  it('should parse JSON body', async () => {
    const server = createServer(async (req: ReqWithBody, res) => {
      await json()(req, res, (err) => err && console.log(err))

      res.setHeader('Content-Type', 'application/json')

      res.end(JSON.stringify(req.body))
    })

    await makeFetch(server)('/', {
      body: JSON.stringify({ hello: 'world' }),
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }).expect(200, { hello: 'world' })
  })

  it('should ignore JSON empty body', async () => {
    const server = createServer(async (req: ReqWithBody, res) => {
      await json()(req, res, (err) => err && console.log(err))

      res.setHeader('Content-Type', 'application/json')

      res.end(JSON.stringify({ ok: true }))
    })

    // Empty string body
    await makeFetch(server)('/', {
      body: '',
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }).expect(200, { ok: true })

    // Unset body
    await makeFetch(server)('/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }).expect(200, { ok: true })
  })

  it('should parse json body with no content-type headers', async () => {
    const server = createServer(async (req: ReqWithBody, res) => {
      await json()(req, res, (err) => err && console.log(err))

      res.setHeader('Content-Type', 'application/json')

      res.end(JSON.stringify(req.body))
    })

    await makeFetch(server)('/', {
      body: JSON.stringify({ hello: 'world' }),
      method: 'POST',
      headers: {
        Accept: 'application/json'
      }
    }).expect(200, { hello: 'world' })
  })

  it('json should call next() without a body', async () => {
    const server = createServer(async (req: ReqWithBody, res) => {
      await json()(req, res, (err) => err && console.log(err))

      res.setHeader('Content-Type', 'application/json')

      res.end()
    })

    await makeFetch(server)('/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }).expect(200)
  })

  it('json should ignore GET request', async () => {
    const server = createServer(async (req: ReqWithBody, res) => {
      await json()(req, res, (err) => err && console.log(err))

      res.end('GET is ignored')
    })

    await makeFetch(server)('/', {
      method: 'GET'
    }).expect(200, 'GET is ignored')
  })

  it('should parse urlencoded body', async () => {
    const server = createServer(async (req: ReqWithBody, res) => {
      await urlencoded()(req, res, (err) => err && console.log(err))

      res.setHeader('Content-Type', 'application/x-www-form-urlencoded')

      res.end(JSON.stringify(req.body))
    })

    await makeFetch(server)('/', {
      body: 'hello=world',
      method: 'POST',
      headers: {
        Accept: 'application/x-www-form-urlencoded',
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).expect(200, { hello: 'world' })
  })

  it('urlencoded should ignore GET request', async () => {
    const server = createServer(async (req: ReqWithBody, res) => {
      await urlencoded()(req, res, (err) => err && console.log(err))

      res.end('GET is ignored')
    })

    await makeFetch(server)('/', {
      method: 'GET'
    }).expect(200, 'GET is ignored')
  })

  it('should parse text body', async () => {
    const server = createServer(async (req: ReqWithBody, res) => {
      await text()(req, res, (err) => err && console.log(err))

      res.setHeader('Content-Type', 'text/plain')

      res.end(req.body)
    })

    await makeFetch(server)('/', {
      body: 'hello world',
      method: 'POST',
      headers: {
        Accept: 'text/plain',
        'Content-Type': 'text/plain'
      }
    }).expect(200, 'hello world')
  })

  it('text should ignore GET request', async () => {
    const server = createServer(async (req: ReqWithBody, res) => {
      await text()(req, res, (err) => err && console.log(err))

      res.setHeader('Content-Type', 'text/plain')

      res.end('GET is ignored')
    })

    await makeFetch(server)('/', {
      method: 'GET',
      headers: {
        Accept: 'text/plain',
        'Content-Type': 'text/plain'
      }
    }).expect(200, 'GET is ignored')
  })

  it('should parse raw body', async () => {
    const server = createServer(async (req: ReqWithBody, res) => {
      await raw()(req, res, (err) => err && console.log(err))

      res.setHeader('Content-Type', 'text/plain')

      res.end(req.body)
    })

    await makeFetch(server)('/', {
      body: 'hello world',
      method: 'POST',
      headers: {
        Accept: 'text/plain',
        'Content-Type': 'text/plain'
      }
    }).expect(200, 'hello world')
  })

  it('raw should ignore GET request', async () => {
    const server = createServer(async (req: ReqWithBody, res) => {
      await raw()(req, res, (err) => err && console.log(err))

      res.setHeader('Content-Type', 'text/plain')

      res.end('GET is ignored')
    })

    await makeFetch(server)('/', {
      method: 'GET',
      headers: {
        Accept: 'text/plain',
        'Content-Type': 'text/plain'
      }
    }).expect(200, 'GET is ignored')
  })

  it('should parse custom body', async () => {
    const server = createServer(async (req: ReqWithBody, res) => {
      await custom((d) => td.decode(d).toUpperCase())(req, res, (err) => err && console.log(err))

      res.setHeader('Content-Type', 'text/plain')

      res.end(req.body)
    })

    await makeFetch(server)('/', {
      body: 'hello world',
      method: 'POST',
      headers: {
        Accept: 'text/plain',
        'Content-Type': 'text/plain'
      }
    }).expect(200, 'HELLO WORLD')
  })

  it('custom should ignore GET request', async () => {
    const server = createServer(async (req: ReqWithBody, res) => {
      await custom((d) => td.decode(d).toUpperCase())(req, res, (err) => err && console.log(err))

      res.setHeader('Content-Type', 'text/plain')

      res.end('GET is ignored')
    })

    await makeFetch(server)('/', {
      method: 'GET',
      headers: {
        Accept: 'text/plain',
        'Content-Type': 'text/plain'
      }
    }).expect(200, 'GET is ignored')
  })
})

describe('Multipart', () => {
  it('should parse multipart body', async () => {
    const server = createServer(async (req: ReqWithBody, res) => {
      await multipart()(req, res, (err) => err && console.log(err))
      res.end(JSON.stringify(req.body))
    })

    const fd = new FormData()

    fd.set('textfield', 'textfield data\nwith new lines\nbecause this is valid')
    fd.set('someother', 'textfield with text')

    await makeFetch(server)('/', {
      // probaly better to use form-data package
      body: fd,
      method: 'POST'
    }).expect(200, {
      textfield: ['textfield data\r\nwith new lines\r\nbecause this is valid'],
      someother: ['textfield with text']
    })
  })

  it('should not parse if boundary is not present', async () => {
    const server = createServer(async (req: ReqWithBody, res) => {
      await multipart()(req, res, (err) => err && res.end(err))

      res.end(JSON.stringify(req.body))
    })

    const fd = new FormData()

    fd.set('textfield', 'textfield data\nwith new lines\nbecause this is valid')

    await makeFetch(server)('/', {
      body: fd,
      method: 'POST',
      headers: {
        Accept: 'multipart/form-data',
        // we override Content-Type so that boundary is not present
        'Content-Type': 'multipart/form-data'
      }
    }).expect(200, {})
  })

  it('should parse multipart with boundary', async () => {
    const server = createServer(async (req: ReqWithBody, res) => {
      await multipart()(req, res, (err) => err && res.end(err))

      res.end(JSON.stringify(req.body))
    })

    await makeFetch(server)('/', {
      // probaly better to use form-data package
      body: '--some-boundary\r\nContent-Disposition: form-data; name="textfield"\r\n\r\ntextfield data\nwith new lines\nbecause this is valid\r\n--some-boundary\r\nContent-Disposition: form-data; name="someother"\r\n\r\ntextfield with text\r\n--some-boundary--\r\n',
      method: 'POST',
      headers: {
        Accept: 'multipart/form-data',
        'Content-Type': 'multipart/form-data; boundary=some-boundary'
      }
    }).expect(200, {
      textfield: ['textfield data\nwith new lines\nbecause this is valid'],
      someother: ['textfield with text']
    })
  })

  it('should parse an array of multipart values', async () => {
    const server = createServer(async (req: ReqWithBody, res) => {
      await multipart()(req, res, (err) => err && console.log(err))

      res.end(JSON.stringify(req.body))
    })

    const fd = new FormData()

    fd.set('textfield', 'textfield data\nwith new lines\nbecause this is valid')
    fd.append('textfield', 'textfield with text')

    await makeFetch(server)('/', {
      // probaly better to use form-data package
      body: fd,
      method: 'POST'
    }).expect(200, {
      textfield: ['textfield data\r\nwith new lines\r\nbecause this is valid', 'textfield with text']
    })
  })

  it('multipart should ignore GET request', async () => {
    const server = createServer(async (req: ReqWithBody, res) => {
      await multipart()(req, res, (err) => err && console.log(err))

      res.end('GET is ignored')
    })

    await makeFetch(server)('/', {
      method: 'GET',
      headers: {
        Accept: 'multipart/form-data',
        'Content-Type': 'multipart/form-data; boundary=some-boundary'
      }
    }).expect(200, 'GET is ignored')
  })

  it('should parse multipart with files', async () => {
    const fd = new FormData()
    const file = new File(['hello world'], 'hello.txt', { type: 'text/plain' })
    fd.set('file', file as Blob)
    const server = createServer(async (req: ReqWithBody<{ file: [File] }>, res) => {
      await multipart()(req, res, (err) => err && console.log(err))

      const formBuf = new Uint8Array(await file.arrayBuffer())
      const buf = new Uint8Array(await req.body!.file[0].arrayBuffer())

      assert.equal(Buffer.compare(buf, formBuf), 0)

      res.end(req.body?.file[0].name)
    })

    await makeFetch(server)('/', {
      // probaly better to use form-data package
      body: fd,
      method: 'POST'
    }).expect(200, 'hello.txt')
  })

  it('should support multiple files', async () => {
    const fd = new FormData()

    const files = [
      new File(['hello world'], 'hello.txt', { type: 'text/plain' }),
      new File(['bye world'], 'bye.txt', { type: 'text/plain' })
    ]

    fd.set('file1', files[0] as Blob)
    fd.set('file2', files[1] as Blob)

    const server = createServer(async (req: ReqWithBody<{ file1: [File]; file2: [File] }>, res) => {
      await multipart()(req, res, (err) => err && console.log(err))

      const files = Object.values(req.body!)

      for (const file of files) {
        const buf = new Uint8Array(await file[0].arrayBuffer())
        const i = files.indexOf(file)
        const formBuf = new Uint8Array(await files[i][0].arrayBuffer())
        assert.strictEqual(Buffer.compare(buf, formBuf), 0)
      }
      res.end('ok')
    })

    await makeFetch(server)('/', {
      body: fd,
      method: 'POST'
    }).expect(200)
  })
  it('should support binary files', async () => {
    const fd = new FormData()
    const file = new File([new Uint8Array([1, 2, 3])], 'blob.bin', { type: 'application/octet-stream' })
    fd.set('file', file as Blob)

    const server = createServer(async (req: ReqWithBody<{ file: [File] }>, res) => {
      await multipart()(req, res, (err) => err && console.log(err))

      const formBuf = new Uint8Array(await file.arrayBuffer())
      const buf = new Uint8Array(await req.body!.file[0].arrayBuffer())

      assert.equal(Buffer.compare(buf, formBuf), 0)
      assert.equal(req.body?.file[0].type, 'application/octet-stream')

      res.end(req.body?.file[0].name)
    })

    await makeFetch(server)('/', {
      // probaly better to use form-data package
      body: fd,
      method: 'POST'
    }).expect(200, 'blob.bin')
  })
})

describe('Limits', () => {
  it('should throw on default payloadLimit', async () => {
    const server = createServer(async (req: ReqWithBody, res) => {
      await text()(req, res, (err) => {
        if (err) res.writeHead(413).end(err.message)
        else res.end(req.body)
      })
    })

    await makeFetch(server)('/', {
      body: new Uint8Array(Buffer.alloc(200 * 1024 ** 2, 'a').buffer),
      method: 'POST',
      headers: {
        Accept: 'text/plain',
        'Content-Type': 'text/plain'
      }
    }).expect(413, 'Payload too large. Limit: 102400 bytes')
  })

  it('should throw on custom payloadLimit', async () => {
    const server = createServer(async (req: ReqWithBody, res) => {
      await text({ payloadLimit: 1024 })(req, res, (err) => {
        if (err) res.writeHead(413).end(err.message)
        else res.end(req.body)
      })
    })

    await makeFetch(server)('/', {
      body: new Uint8Array(Buffer.alloc(1024 ** 2, 'a').buffer),
      method: 'POST',
      headers: {
        Accept: 'text/plain',
        'Content-Type': 'text/plain'
      }
    }).expect(413, 'Payload too large. Limit: 1024 bytes')
  })

  it('should throw on payloadLimit with custom error message', async () => {
    const server = createServer(async (req: ReqWithBody, res) => {
      await text({
        payloadLimit: 1024,
        payloadLimitErrorFn: (payloadLimit) => new Error(`Payload too large. Limit: ${payloadLimit / 1024}KB`)
      })(req, res, (err) => {
        if (err) res.writeHead(413).end(err.message)
        else res.end(req.body)
      })
    })

    await makeFetch(server)('/', {
      body: new Uint8Array(Buffer.alloc(1024 ** 2, 'a').buffer),
      method: 'POST',
      headers: {
        Accept: 'text/plain',
        'Content-Type': 'text/plain'
      }
    }).expect(413, 'Payload too large. Limit: 1KB')
  })

  it('should throw multipart if amount of files exceeds limit', async () => {
    const server = createServer(async (req: ReqWithBody, res) => {
      await multipart({ fileCountLimit: 1 })(req, res, (err) => {
        if (err) res.writeHead(413).end(err.message)
        else res.end(req.body)
      })
    })

    const fd = new FormData()

    fd.set('file1', new File(['hello world'], 'hello.txt', { type: 'text/plain' }) as Blob)
    fd.set('file2', new File(['bye world'], 'bye.txt', { type: 'text/plain' }) as Blob)

    await makeFetch(server)('/', {
      body: fd,
      method: 'POST'
    }).expect(413, 'Too many files. Limit: 1')
  })

  it('should throw multipart if exceeds allowed file size', async () => {
    const server = createServer(async (req: ReqWithBody, res) => {
      await multipart({ fileSizeLimit: 10 })(req, res, (err) => {
        if (err) res.writeHead(413).end(err.message)
        else res.end(req.body)
      })
    })

    const fd = new FormData()

    fd.set('file', new File(['hello world'], 'hello.txt', { type: 'text/plain' }) as Blob)

    await makeFetch(server)('/', {
      body: fd,
      method: 'POST'
    }).expect(413, 'File too large. Limit: 10 bytes')
  })

  it('should throw multipart if exceeds allowed file size with a custom error', async () => {
    const server = createServer(async (req: ReqWithBody, res) => {
      await multipart({
        fileSizeLimit: 20,
        fileSizeLimitErrorFn: (limit) => new Error(`File too large. Limit: ${limit / 1024}KB`)
      })(req, res, (err) => {
        if (err) res.writeHead(413).end(err.message)
      })
    })

    const fd = new FormData()

    fd.set('file', new File(['hello world to everyone'], 'hello.txt', { type: 'text/plain' }) as Blob)

    await makeFetch(server)('/', {
      body: fd,
      method: 'POST'
    }).expect(413, 'File too large. Limit: 0.01953125KB')
  })
})

describe('Framework integration', { timeout: 500 }, () => {
  it('works with tinyhttp', async () => {
    const app = new App()

    app
      .use('/json', json())
      .use('/url', urlencoded())
      .post((req, res) => {
        res.json(req.body)
      })

    const server = app.listen()

    const fetch = makeFetch(server)

    await fetch('/json', {
      body: JSON.stringify({ hello: 'world' }),
      method: 'POST'
    }).expect(200, { hello: 'world' })

    await fetch('/url', {
      body: 'hello=world',
      method: 'POST'
    })
      .expect(200, { hello: 'world' })
      .then(() => server.close())
  })
})
