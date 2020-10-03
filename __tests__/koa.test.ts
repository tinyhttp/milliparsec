import Koa from 'koa'
import { makeFetch } from 'supertest-fetch'
import { test } from 'uvu'
import { CtxWithBody, json, urlencoded } from '../src/koa'

test('should parse JSON body', async () => {
  const app = new Koa()

  app.use(json())

  app.use(async (ctx: CtxWithBody) => {
    ctx.body = ctx.req.body
    ctx.res.setHeader('Content-Type', 'application/json')
  })

  const server = app.listen()

  await makeFetch(server)('/', {
    body: JSON.stringify({ hello: 'world' }),
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
  }).expect(200, { hello: 'world' })
})

test.run()

test('should parse urlencoded body', async () => {
  const app = new Koa()

  app.use(urlencoded())

  app.use(async (ctx: CtxWithBody) => {
    ctx.body = ctx.req.body
    ctx.res.setHeader('Content-Type', 'application/x-www-form-urlencoded')
  })

  const server = app.listen()

  await makeFetch(server)('/', {
    method: 'POST',
    body: 'hello=world',
    headers: {
      Accept: 'application/x-www-form-urlencoded',
    },
  }).expect(200, { hello: 'world' })
})

test.run()
