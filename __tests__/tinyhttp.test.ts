import { App } from '@tinyhttp/app'
import supertest from 'supertest'
import { json, urlencoded } from '../src/index'

describe('tinyhttp middleware test', () => {
  it('should parse JSON body', (done) => {
    const app = new App()

    app.use(json())

    app.post('/', (req, res) => {
      res.setHeader('Content-Type', 'application/json')
      res.json(req.body)
    })

    const server = app.listen()

    const request = supertest(server)

    request.post('/').send({ hello: 'world' }).set('Accept', 'application/json').expect(
      200,
      {
        hello: 'world',
      },
      done
    )
  })
  it('should parse form', (done) => {
    const app = new App()

    app.use(urlencoded())

    app.post('/', async (req, res) => {
      res.setHeader('Content-Type', 'application/json')
      res.json(req.body)
    })

    const server = app.listen()

    const request = supertest(server)

    request.post('/').send('hello=world').set('Accept', 'application/x-www-form-urlencoded').expect(
      200,
      {
        hello: 'world',
      },
      done
    )
  })
})
