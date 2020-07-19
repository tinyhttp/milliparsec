import { createServer } from 'http'
import supertest from 'supertest'
import { json, form, ReqWithBody } from '../src/index'

describe('Vanilla middleware test', () => {
  it('should parse JSON body', (done) => {
    const app = createServer(async (req: ReqWithBody, res) => {
      if (req.method === 'POST') {
        await json()(req)
        res.setHeader('Content-Type', 'application/json')

        res.end(JSON.stringify(req.body, null, 2))
      }
    })

    const server = app.listen()

    const request = supertest(app)

    request
      .post('/')
      .send({ hello: 'world' })
      .set('Accept', 'application/json')
      .expect(200, {
        hello: 'world',
      })
      .end((err) => {
        server.close()
        if (err) return done(err)
        done()
      })
  })
  it('should parse form', (done) => {
    const app = createServer(async (req: ReqWithBody, res) => {
      if (req.method === 'POST') {
        await form()(req)
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(req.body, null, 2))
      }
    })

    const server = app.listen()

    const request = supertest(app)

    request
      .post('/')
      .send('hello=world')
      .set('Accept', 'application/x-www-form-urlencoded ')
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
