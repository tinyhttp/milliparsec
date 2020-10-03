import { App } from '@tinyhttp/app'
import { urlencoded } from '../../dist/index.js'

const app = new App()

app
  .use(async (req, res, next) => {
    await urlencoded()(req, res, next)
  })
  .post('/', (req, res) => {
    res.send(req.body || {})
  })

app.listen(3000, () => console.log(`Started on http://localhost:3000`))
