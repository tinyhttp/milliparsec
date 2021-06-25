import Koa from 'koa'
import { makeFetch } from 'supertest-fetch'
import { suite } from 'uvu'
import { CtxWithBody, custom, json, raw, text, urlencoded } from '../src/koa'

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

test('json should ignore GET request', async () => {
  const app = new Koa<Koa.DefaultState, CtxWithBody>()

  app.use(json()).use(async (ctx: CtxWithBody) => {
    ctx.body = 'GET is ignored'
    ctx.set('Content-Type', 'application/json')
  })

  const server = app.listen()

  await makeFetch(server)('/', {
    method: 'GET',
  })
    .expect(200, 'GET is ignored')
    .then(() => server.close())
})

test('json should call next() without a body', async () => {
  const app = new Koa<Koa.DefaultState, CtxWithBody>()

  app.use(json()).use(async (ctx: CtxWithBody) => {
    ctx.status = 200
    ctx.set('Content-Type', 'application/json')
  })

  const server = app.listen()

  await makeFetch(server)('/', {
    method: 'POST',
  })
    .expect(200)
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

test('urlencoded should ignore GET request', async () => {
  const app = new Koa<Koa.DefaultState, CtxWithBody>()

  app.use(urlencoded()).use(async (ctx: CtxWithBody) => {
    ctx.body = 'GET is ignored'
    ctx.set('Content-Type', 'application/x-www-form-urlencoded')
  })

  const server = app.listen()

  await makeFetch(server)('/', {
    method: 'GET',
  })
    .expect(200, 'GET is ignored')
    .then(() => server.close())
})

test('should parse text body', async () => {
  const app = new Koa<Koa.DefaultState, CtxWithBody>()

  app.use(text())

  app.use(async (ctx: CtxWithBody) => {
    ctx.body = ctx.parsedBody
    ctx.set('Content-Type', 'text/plain')
  })

  const server = app.listen()

  await makeFetch(server)('/', {
    method: 'POST',
    body: 'hello world',
  })
    .expect(200, 'hello world')
    .then(() => server.close())
})

test('text should ignore GET request', async () => {
  const app = new Koa<Koa.DefaultState, CtxWithBody>()

  app.use(text()).use(async (ctx: CtxWithBody) => {
    ctx.body = 'GET is ignored'
    ctx.set('Content-Type', 'text/plain')
  })

  const server = app.listen()

  await makeFetch(server)('/', {
    method: 'GET',
  })
    .expect(200, 'GET is ignored')
    .then(() => server.close())
})

test('should parse raw body', async () => {
  const app = new Koa<Koa.DefaultState, CtxWithBody>()

  app.use(raw())

  app.use(async (ctx: CtxWithBody) => {
    ctx.body = ctx.parsedBody
    ctx.set('Content-Type', 'text/plain')
  })

  const server = app.listen()

  await makeFetch(server)('/', {
    method: 'POST',
    body: 'hello world',
  })
    .expect(200, 'hello world')
    .then(() => server.close())
})

test('raw should ignore GET request', async () => {
  const app = new Koa<Koa.DefaultState, CtxWithBody>()

  app.use(raw()).use(async (ctx: CtxWithBody) => {
    ctx.body = 'GET is ignored'
    ctx.set('Content-Type', 'text/plain')
  })

  const server = app.listen()

  await makeFetch(server)('/', {
    method: 'GET',
  })
    .expect(200, 'GET is ignored')
    .then(() => server.close())
})

test('should parse custom body', async () => {
  const app = new Koa<Koa.DefaultState, CtxWithBody>()

  app.use(custom((d) => d.toUpperCase()))

  app.use(async (ctx: CtxWithBody) => {
    ctx.body = ctx.parsedBody
    ctx.set('Content-Type', 'text/plain')
  })

  const server = app.listen()

  await makeFetch(server)('/', {
    method: 'POST',
    body: 'hello world',
  })
    .expect(200, 'HELLO WORLD')
    .then(() => server.close())
})

test('custom should ignore GET request', async () => {
  const app = new Koa<Koa.DefaultState, CtxWithBody>()

  app.use(custom((d) => d.toUpperCase())).use(async (ctx: CtxWithBody) => {
    ctx.body = 'GET is ignored'
    ctx.set('Content-Type', 'text/plain')
  })

  const server = app.listen()

  await makeFetch(server)('/', {
    method: 'GET',
  })
    .expect(200, 'GET is ignored')
    .then(() => server.close())
})

test.run()
