import Koa from 'koa'
import supertest from 'supertest'
import { json, CtxWithBody } from '../src/koa'

describe('Koa middleware test', () => {
  it('should parse JSON body', (done) => {
    const app = new Koa()

    app.use(json())

    app.use((ctx: CtxWithBody) => {
      if (ctx.method === 'POST') {
        ctx.type = 'application/json'
        ctx.body = ctx.req.body
      }
    })

    const server = app.listen()

    const request = supertest(server)

    request
      .post('/')
      .send({ hello: 'world' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(200, {
        hello: 'world',
      })
      .end((err) => {
        server.close()
        if (err) return done(err)
        done()
      })
  })
})
