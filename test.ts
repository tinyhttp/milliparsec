import assert from 'node:assert'
import { Buffer } from 'node:buffer'
import { createServer } from 'node:http'
import { test } from 'node:test'
import { makeFetch } from 'supertest-fetch'
import { type ReqWithBody, custom, json, multipart, raw, text, urlencoded } from './src/index.js'

test('should parse JSON body', async () => {
  const server = createServer(async (req: ReqWithBody, res) => {
    await json()(req, res, (err) => void err && console.log(err))

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

test('should ignore JSON empty body', async () => {
  const server = createServer(async (req: ReqWithBody, res) => {
    await json()(req, res, (err) => void err && console.log(err))

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

test('should parse json body with no content-type headers', async () => {
  const server = createServer(async (req: ReqWithBody, res) => {
    await json()(req, res, (err) => void err && console.log(err))

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

test('json should call next() without a body', async () => {
  const server = createServer(async (req: ReqWithBody, res) => {
    await json()(req, res, (err) => void err && console.log(err))

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

test('json should ignore GET request', async () => {
  const server = createServer(async (req: ReqWithBody, res) => {
    await json()(req, res, (err) => void err && console.log(err))

    res.end('GET is ignored')
  })

  await makeFetch(server)('/', {
    method: 'GET'
  }).expect(200, 'GET is ignored')
})

test('should parse urlencoded body', async () => {
  const server = createServer(async (req: ReqWithBody, res) => {
    await urlencoded()(req, res, (err) => void err && console.log(err))

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

test('urlencoded should ignore GET request', async () => {
  const server = createServer(async (req: ReqWithBody, res) => {
    await urlencoded()(req, res, (err) => void err && console.log(err))

    res.end('GET is ignored')
  })

  await makeFetch(server)('/', {
    method: 'GET'
  }).expect(200, 'GET is ignored')
})

test('should parse text body', async () => {
  const server = createServer(async (req: ReqWithBody, res) => {
    await text()(req, res, (err) => void err && console.log(err))

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

test('text should ignore GET request', async () => {
  const server = createServer(async (req: ReqWithBody, res) => {
    await text()(req, res, (err) => void err && console.log(err))

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

test('should parse raw body', async () => {
  const server = createServer(async (req: ReqWithBody, res) => {
    await raw()(req, res, (err) => void err && console.log(err))

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

test('raw should ignore GET request', async () => {
  const server = createServer(async (req: ReqWithBody, res) => {
    await raw()(req, res, (err) => void err && console.log(err))

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

test('should parse custom body', async () => {
  const server = createServer(async (req: ReqWithBody, res) => {
    await custom((d) => d.toUpperCase())(req, res, (err) => void err && console.log(err))

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

test('custom should ignore GET request', async () => {
  const server = createServer(async (req: ReqWithBody, res) => {
    await custom((d) => d.toUpperCase())(req, res, (err) => void err && console.log(err))

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

test('should parse multipart body', async () => {
  const server = createServer(async (req: ReqWithBody, res) => {
    await multipart()(req, res, (err) => void err && console.log(err))

    res.setHeader('Content-Type', 'multipart/form-data')
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

test('should parse multipart with boundary', async () => {
  const server = createServer(async (req: ReqWithBody, res) => {
    await multipart()(req, res, (err) => void err && console.log(err))

    res.setHeader('Content-Type', 'multipart/form-data; boundary=some-boundary')

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

test('should parse an array of multipart values', async () => {
  const server = createServer(async (req: ReqWithBody, res) => {
    await multipart()(req, res, (err) => void err && console.log(err))

    res.setHeader('Content-Type', 'multipart/form-data; boundary=some-boundary')

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
    textfield: ['textfield data\r\nwith new lines\r\nbecause this is valid', 'textfield with text'],
  })
})

test('multipart should ignore GET request', async () => {
  const server = createServer(async (req: ReqWithBody, res) => {
    await multipart()(req, res, (err) => void err && console.log(err))

    res.setHeader('Content-Type', 'multipart/form-data; boundary=some-boundary')

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

test('should parse multipart with files', async () => {
  const fd = new FormData()
  const file = new File(['hello world'], 'hello.txt', { type: 'text/plain' })
  fd.set('file', file)
  const server = createServer(async (req: ReqWithBody<{ file: [File] }>, res) => {
    await multipart()(req, res, (err) => void err && console.log(err))

    res.setHeader('Content-Type', 'multipart/form-data')

    const formBuf = new Uint8Array(await file.arrayBuffer())
    const buf = new Uint8Array(await (req.body!.file[0]).arrayBuffer())

    assert.equal(Buffer.compare(buf, formBuf), 0)

    res.end(req.body?.file[0].name)
  })

  await makeFetch(server)('/', {
    // probaly better to use form-data package
    body: fd,
    method: 'POST'
  }).expect(200, 'hello.txt')
})

test('should support multiple files', async () => {
  const fd = new FormData()

  const files = [
    new File(['hello world'], 'hello.txt', { type: 'text/plain' }),
    new File(['bye world'], 'bye.txt', { type: 'text/plain' })
  ]

  fd.set('file1', files[0])
  fd.set('file2', files[1])

  const server = createServer(async (req: ReqWithBody<{ file1: [File]; file2: [File] }>, res) => {
    await multipart()(req, res, (err) => void err && console.log(err))

    res.setHeader('Content-Type', 'multipart/form-data')

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

test('should throw on default payloadLimit', async () => {
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
  }).expect(413, 'Payload too large. Limit: 104857600 bytes')
})

test('should throw on custom payloadLimit', async () => {
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

test('should throw on payloadLimit with custom error message', async () => {
  const server = createServer(async (req: ReqWithBody, res) => {
    await text({ payloadLimit: 1024, payloadLimitErrorFn: (payloadLimit) => new Error(`Payload too large. Limit: ${payloadLimit / 1024}KB`) })(req, res, (err) => {
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

test('should throw multipart if amount of files exceeds limit', async () => {
  const server = createServer(async (req: ReqWithBody, res) => {
    await multipart({ fileCountLimit: 1 })(req, res, (err) => {
      if (err) res.writeHead(413).end(err.message)
      else res.end(req.body)
    })
  })

  const fd = new FormData()

  fd.set('file1', new File(['hello world'], 'hello.txt', { type: 'text/plain' }))
  fd.set('file2', new File(['bye world'], 'bye.txt', { type: 'text/plain' }))

  await makeFetch(server)('/', {
    body: fd,
    method: 'POST',
  }).expect(413, 'Too many files. Limit: 1')
})

test('should throw multipart if exceeds allowed file size', async () => {
  const server = createServer(async (req: ReqWithBody, res) => {
    await multipart({ fileSizeLimit: 10 })(req, res, (err) => {
      if (err) res.writeHead(413).end(err.message)
      else res.end(req.body)
    })
  })

  const fd = new FormData()

  fd.set('file', new File(['hello world'], 'hello.txt', { type: 'text/plain' }))

  await makeFetch(server)('/', {
    body: fd,
    method: 'POST',
  }).expect(413, 'File too large. Limit: 10 bytes')
})

test('should throw multipart if exceeds allowed file size with a custom error', async () => {
  const server = createServer(async (req: ReqWithBody, res) => {
    await multipart({ fileSizeLimit: 10, fileSizeLimitErrorFn: (limit) => new Error(`File too large. Limit: ${limit / 1024}KB`) })(req, res, (err) => {
      if (err) res.writeHead(413).end(err.message)
      else res.end(req.body)
    })
  })

  const fd = new FormData()

  fd.set('file', new File(['hello world'], 'hello.txt', { type: 'text/plain' }))

  await makeFetch(server)('/', {
    body: fd,
    method: 'POST',
  }).expect(413, 'File too large. Limit: 0.009765625KB')
})