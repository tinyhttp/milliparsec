import Express from 'express'
import supertest from 'supertest'
import { json, form } from '../src/index'

describe('Express middleware test', () => {
  it('should parse JSON body', (done) => {
    const app = Express()

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
    const app = Express()

    app.use(form())

    app.post('/', (req, res) => {
      res.setHeader('Content-Type', 'application/json')
      res.json(req.body)
    })

    const server = app.listen()

    const request = supertest(server)

    request.post('/').send('hello=world').set('Accept', 'application/x-www-form-urlencoded ').expect(
      200,
      {
        hello: 'world',
      },
      done
    )
  })
})
