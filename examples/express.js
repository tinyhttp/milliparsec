import Express from 'express'
import { form } from '../lib/body-parsec'

const app = new Express()

app.use(async (req, res, next) => await form(req, next))

app.get('/', (req, res) => {
  res.send(`
  <form method="POST" action="/">
  <input name="name" />
  </form>
  `)
})

app.post('/', async (req, res) => {
  res.send(`Hello ${req.body.name}!`)
})

app.listen(80, () => console.log(`Running on http://localhost`))
