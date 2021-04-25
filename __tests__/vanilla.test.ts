import { createServer } from 'http'
import { makeFetch } from 'supertest-fetch'
import { test } from 'uvu'
import { json, ReqWithBody, urlencoded } from '../src/index'

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
      'Content-Type': 'application/json',
    },
  }).expect(200, { hello: 'world' })
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
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }).expect(200, { hello: 'world' })
})

test('should ignore GET request', async () => {
  const server = createServer(async (req: ReqWithBody, res) => {
    await urlencoded()(req, res, (err) => void err && console.log(err))

    res.end('GET is ignored')
  })

  await makeFetch(server)('/', {
    method: 'GET',
  }).expect(200, 'GET is ignored')
})

test.run()
