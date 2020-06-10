import Express from 'express'
// @ts-ignore
import * as parsec from '../../dist/index.js'

const app = Express()

app.use(parsec.json())

app.post('/', async (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.json(req.body)
})

app.listen(3000, () => console.log(`Listening on http://localhost:3000`))
