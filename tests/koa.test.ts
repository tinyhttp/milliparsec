import Koa from 'koa'
import { makeFetch } from 'supertest-fetch'
import { suite } from 'uvu'
import { CtxWithBody, json, urlencoded } from '../src/koa'

const test = suite('koa')

test('should parse JSON body', async () => {
  const app = new Koa<Koa.DefaultState, CtxWithBody>()

  app.use(json()).use(async (ctx: CtxWithBody) => {
    ctx.body = ctx.parsedBody
    ctx.set('Content-Type', 'application/json')
  })

  const server = app.listen()

  await makeFetch(server)('/', {
    body: JSON.stringify({ hello: 'world' }),
    method: 'POST',
  })
    .expect(200, { hello: 'world' })
    .then(() => server.close())
})

test('should parse urlencoded body', async () => {
  const app = new Koa<Koa.DefaultState, CtxWithBody>()

  app.use(urlencoded())

  app.use(async (ctx: CtxWithBody) => {
    ctx.body = ctx.parsedBody
    ctx.set('Content-Type', 'application/x-www-form-urlencoded')
  })

  const server = app.listen()

  await makeFetch(server)('/', {
    method: 'POST',
    body: 'hello=world',
  })
    .expect(200, { hello: 'world' })
    .then(() => server.close())
})

test.run()
