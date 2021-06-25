<div align="center">

<img src="milliparsec.svg" alt="Milliparsec" />
 

![Vulnerabilities][vulns-badge-url]
[![Version][v-badge-url]][npm-url] [![Codecov][cov-badge-url]][cov-url] [![Github actions][gh-actions-img]][github-actions] [![Downloads][dl-badge-url]][npm-url]

</div>

> _Photo by NASA published on [Unsplash](https://unsplash.com/photos/rTZW4f02zY8)_

Tiniest body parser in the universe. Built for modern Node.js.

Check out [deno-libs/parsec](https://github.com/deno-libs/parsec) for Deno port.

## Features

- ⏩ built with `async` / `await`
- 🛠 JSON / raw / urlencoded data support
- 📦 tiny package size (728B)
- 🔥 no dependencies
- ⚡ [tinyhttp](https://github.com/talentlessguy/tinyhttp), [Koa](https://github.com/koajs/koa) and Express support

## Install

```sh
# pnpm
pnpm i milliparsec

# yarn
yarn add milliparsec

# npm
npm i milliparsec
```

## Usage

### Basic example

Use a middleware inside a server:

```js
import { createServer } from 'http'
import { json } from 'milliparsec'

const server = createServer(async (req: ReqWithBody, res) => {
  await json()(req, res, (err) => void err && console.log(err))

  res.setHeader('Content-Type', 'application/json')

  res.end(JSON.stringify(req.body))
})
```

### Web frameworks integration

#### tinyhttp

```ts
import { App } from '@tinyhttp/app'
import { urlencoded } from 'milliparsec'

new App()
  .use(urlencoded())
  .post('/', (req, res) => void res.send(req.body))
  .listen(3000, () => console.log(`Started on http://localhost:3000`))
```

#### Koa

```ts
import Koa from 'koa'
import { json, CtxWithBody } from 'milliparsec/koa'

new Koa()
  .use(json())
  .use((ctx: CtxWithBody) => {
    if (ctx.method === 'POST') {
      ctx.type = 'application/json'
      ctx.body = ctx.parsedBody
    }
  })
  .listen(3000, () => console.log(`Running on http://localhost:3000`))
```

## API

### `raw(req, res, cb)`

Minimal body parsing without any formatting.

### `text(req, res, cb)`

Converts request body to string.

### `urlencoded(req, res, cb)`

Parses request body using `querystring.parse`.

### `json(req, res, cb)`

Parses request body using `JSON.parse`.

### `custom(fn)(req, res, cb)`

Custom function for `parsec`.

```js
// curl -d "this text must be uppercased" localhost
await custom(
  req,
  (d) => d.toUpperCase(),
  (err) => {}
)
res.end(req.body) // "THIS TEXT MUST BE UPPERCASED"
```

### What is "parsec"?

The parsec is a unit of length used to measure large distances to astronomical objects outside the Solar System.

[vulns-badge-url]: https://img.shields.io/snyk/vulnerabilities/npm/milliparsec.svg?style=for-the-badge&color=25608B&label=vulns
[v-badge-url]: https://img.shields.io/npm/v/milliparsec.svg?style=for-the-badge&color=25608B&logo=npm&label=
[npm-url]: https://www.npmjs.com/package/milliparsec
[cov-badge-url]: https://img.shields.io/codecov/c/gh/talentlessguy/milliparsec?style=for-the-badge&color=25608B
[cov-url]: https://codecov.io/gh/talentlessguy/milliparsec
[dl-badge-url]: https://img.shields.io/npm/dt/milliparsec?style=for-the-badge&color=25608B
[github-actions]: https://github.com/talentlessguy/milliparsec/actions
[gh-actions-img]: https://img.shields.io/github/workflow/status/talentlessguy/milliparsec/CI?style=for-the-badge&color=25608B&label=&logo=github
