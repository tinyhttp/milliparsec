import Koa from 'koa'
import { form } from '../lib/body-parsec'

const app = new Koa()

app
  .use(async ctx => {
    if (ctx.method === 'GET') {
      ctx.body = `
      <form method="POST" action="/">
        <input name="name" />
      </form>`
    } else {
      await form(ctx.req)
      ctx.body = `Hello ${ctx.req.body.name}!`
    }
  })
  .listen(80, () => console.log('Listening on http://localhost'))
