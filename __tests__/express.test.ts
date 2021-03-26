import Express from 'express'
import { makeFetch } from 'supertest-fetch'
import { suite } from 'uvu'
import { json, urlencoded } from '../src/index'

const test = suite('express')

test('should parse JSON body', async () => {
  const app = Express()

  app.use(json())

  app.post('/', (req, res) => {
    res.set('Content-Type', 'application/json').json(req.body)
  })

  await makeFetch(app)('/', {
    body: JSON.stringify({ hello: 'world' }),
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).expect(200, { hello: 'world' })
})

test.run()

test('should parse urlencoded body', async () => {
  const app = Express()

  app.use(urlencoded())

  app.post('/', (req, res) => {
    res.set('Content-Type', 'application/x-www-form-urlencoded').json(req.body)
  })

  await makeFetch(app)('/', {
    method: 'POST',
    body: 'hello=world',
    headers: {
      Accept: 'application/x-www-form-urlencoded',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }).expect(200, { hello: 'world' })
})

test('should not parse if Content-Type is not present', async () => {
  const app = Express()

  app.use(urlencoded())

  app.post('/', (req, res) => {
    res.set('Content-Type', 'application/x-www-form-urlencoded').json(req.body)
  })

  await makeFetch(app)('/', {
    method: 'POST',
    body: 'hello=world',
    headers: {},
  }).expect(415)
})

test.run()
