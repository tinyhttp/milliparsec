<img src="logo.jpg" width="100%" />

<div align="center"><h1>milliparsec 🌌</h1></div>

> _Photo by NASA published on [Unsplash](https://unsplash.com/photos/rTZW4f02zY8)_

![Top lang][top-lang-badge-url]
![Vulnerabilities][vulns-badge-url]
[![Version][v-badge-url]][npm-url]
![Last commit][last-commit-badge-url]
![Minified size][size-badge-url] [![Codecov][cov-badge-url]][cov-url] [![Downloads][dl-badge-url]][npm-url]

Tiniest body parser in the universe. Built for modern Node.js.

> ℹ️ Check out [deno-libs/parsec](https://github.com/deno-libs/parsec) for Deno port.

## Features

- ⏩ built with `async` / `await`
- 🛠 JSON / raw / urlencoded data support
- 📦 tiny package size (728B)
- 🔥 no dependencies
- ⚡ [tinyhttp](https://github.com/talentlessguy/tinyhttp), [Koa](https://github.com/koajs/koa) and Express support
- 💂 send `415 Unsupported Media Type` on

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

createServer(async (req, res) => {
  const parsedData = await json()(req, res, (err) => {
    if (err) {
      res.writeHead(500)
      res.end('oops')
    }
  })
  console.log(parsedData) // { 'hello': 'world' }
  res.setHeader('Content-Type', 'application/json')
  res.end(req.body.hello) // 'world'
}).listen(3000)
```

Then send a request:

```sh
curl -d '{ "hello": "world" }' localhost
```

It should output `world`.

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

#### Express

```ts
import Express from 'express'
import { urlencoded } from 'milliparsec'

Express()
  .use(urlencoded())
  .get(
    '/',
    (req, res) =>
      void res.send(`
  <form method="POST" action="/" enctype="application/x-www-form-urlencoded">
  <input name="name" />
  </form>
  `)
  )
  .post('/', (req, res) => void res.send(`Hello ${req.body.name}!`))
  .listen(3000, () => console.log(`Running on http://localhost:3000`))
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
      ctx.body = ctx.req.body
    }
  })
  .listen(3000, () => console.log(`Running on http://localhost:3000`))
```

## API

### `parsec.raw(req, res, cb)`

Minimal body parsing without any formatting.

### `parsec.text(req, res, cb)`

Converts request body to string.

### `parsec.urlencoded(req, res, cb)`

Parses request body using `querystring.parse`.

### `parsec.json(req, res, cb)`

Parses request body using `JSON.parse`.

### `parsec.custom(fn)(req, res, cb)`

Custom function for `parsec`.

```js
// curl -d "this text must be uppercased" localhost
await parsec.custom(
  req,
  (d) => d.toUpperCase(),
  (err) => {}
)
res.end(req.body) // "THIS TEXT MUST BE UPPERCASED"
```

### What is "parsec"?

The parsec is a unit of length used to measure large distances to astronomical objects outside the Solar System.

[top-lang-badge-url]: https://img.shields.io/github/languages/top/talentlessguy/milliparsec.svg?style=flat-square
[vulns-badge-url]: https://img.shields.io/snyk/vulnerabilities/npm/milliparsec.svg?style=flat-square
[v-badge-url]: https://img.shields.io/npm/v/milliparsec.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/milliparsec
[last-commit-badge-url]: https://img.shields.io/github/last-commit/talentlessguy/milliparsec.svg?style=flat-square
[size-badge-url]: https://img.shields.io/bundlephobia/min/milliparsec.svg?style=flat-square
[cov-badge-url]: https://img.shields.io/codecov/c/gh/talentlessguy/milliparsec?style=flat-square
[cov-url]: https://codecov.io/gh/talentlessguy/milliparsec
[dl-badge-url]: https://img.shields.io/npm/dt/milliparsec?style=flat-square
