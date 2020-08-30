import { createServer, IncomingMessage } from 'http'
import supertest from 'supertest'
import { json, urlencoded, ReqWithBody } from '../src/index'

type Request = ReqWithBody & IncomingMessage

describe('Vanilla middleware test', () => {
  it('should parse JSON body', (done) => {
    const app = createServer(async (req: Request, res) => {
      if (req.method === 'POST') {
        await json()(req)
        res.setHeader('Content-Type', 'application/json')

        res.end(JSON.stringify(req.body, null, 2))
      }
    })

    const request = supertest(app)

    request.post('/').send({ hello: 'world' }).set('Accept', 'application/json').expect(
      200,
      {
        hello: 'world',
      },
      done
    )
  })
  it('should parse form', (done) => {
    const app = createServer(async (req: Request, res) => {
      if (req.method === 'POST') {
        await urlencoded()(req)
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(req.body, null, 2))
      }
    })

    const request = supertest(app)

    request.post('/').send('hello=world').set('Accept', 'application/x-www-form-urlencoded ').expect(
      200,
      {
        hello: 'world',
      },
      done
    )
  })
})
