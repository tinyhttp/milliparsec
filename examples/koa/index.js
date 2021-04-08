import Koa from 'koa'

import * as parsec from '../../dist/koa.js'

const app = new Koa()

app.use(parsec.json())

app.use((ctx) => {
  if (ctx.method === 'POST') {
    ctx.type = 'application/json'
    // @ts-ignore
    ctx.body = ctx.parsedBody
  }
})

app.listen(3000, () => console.log(`Listening on http://localhost:3000`))
