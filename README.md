# milliparsec 🌌

![Top lang](https://img.shields.io/github/languages/top/talentlessguy/parsec.svg?style=flat-square)
![Vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/milliparsec.svg?style=flat-square)
![Version](https://img.shields.io/npm/v/milliparsec.svg?style=flat-square)
![Last commit](https://img.shields.io/github/last-commit/talentlessguy/parsec.svg?style=flat-square)
![Minified size](https://img.shields.io/bundlephobia/min/milliparsec.svg?style=flat-square) ![Codecov](https://img.shields.io/codecov/c/gh/talentlessguy/parsec?style=flat-square)

Tiniest body parser in the universe. Built for modern Node.js.

> milliparsec is a part of [tinyhttp](https://github.com/talentlessguy/tinyhttp) ecosystem.

## Features 👀

- 🚀 works with Node 13+ ESM and CommonJS
- ⏩ built with `async` / `await`
- 🛠 JSON / raw / urlencoded / text data support
- 📦 tiny package size (800B)
- 🔥 no dependencies
- [tinyhttp](https://github.com/talentlessguy/tinyhttp), Koa and Express support

## Installation 🔄

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
import { createServer } = from 'http'
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
}).listen(80)
```

Then try to make a request to our server:

```sh
curl -d '{ "hello": "world" }' localhost
```

After sending a request, it should output `world`.

### Parsec and web frameworks

## [tinyhttp](https://github.com/talentlessguy/tinyhttp) ⚡

```ts
import { App } from '@tinyhttp/app'
import { urlencoded } from 'milliparsec'

const app = new App()

app.use(urlencoded()).post('/', (req, res) => {
  res.send(req.body)
})

app.listen(3000, () => console.log(`Started on http://localhost:3000`))
```

## Express

```ts
import Express from 'express'
import { urlencoded } from 'milliparsec'

const app = Express()

app.use(urlencoded())

app.get('/', (req, res) => {
  res.send(`
  <form method="POST" action="/" enctype="application/x-www-form-urlencoded">
  <input name="name" />
  </form>
  `)
})

app.post('/', (req, res) => {
  res.send(`Hello ${req.body.name}!`)
})

app.listen(3000, () => console.log(`Running on http://localhost:3000`))
```

## Koa

```ts
import Koa from 'koa'
import { json, CtxWithBody } from 'milliparsec/koa'

const app = new Koa()

app.use(json())

app.use((ctx: CtxWithBody) => {
  if (ctx.method === 'POST') {
    ctx.type = 'application/json'
    ctx.body = ctx.req.body
  }
})

app.listen(3000, () => console.log(`Running on http://localhost:3000`))
```

### API

#### `parsec.raw(req)`

Minimal body parsing without any urlencodedatting (even without converting to string):

```js
// Request: curl -d "Hello World"
await parsec.raw()(req, res, (err) => {})
res.end(req.body) // "Hello World"
```

#### `parsec.text(req)`

Converts request body to string.

```js
// Request: curl -d "Hello World"
await parsec.text()(req, res, (err) => {})
res.end(req.body) // "Hello World"
```

#### `parsec.custom(req, fn)`

You can use `parsec` as a a handler for `IncomingMessage` with a custom urlencodedatter.

Here we make a request body upper case:

```js
// Request: curl -d "this text must be uppercased" localhost
await parsec.custom(
  req,
  (data) => data.toUpperCase(),
  (err) => {}
)
res.end(req.body) // "THIS TEXT MUST BE UPPERCASED"
```

#### `parsec.json(req)`

Parses request body using `JSON.parse`.

```js
// Request: curl -d { "hello": "world" } localhost
await parsec.json()(req, res, (err) => {})
res.end(req.body.hello) // world
```

#### `parsec.urlencoded(req)`

Parses request body using `querystring.parse`.

```js
// Request: curl -d 'username=pro_gamer'
await parsec.urlencoded()(req, res, (err) => {})
res.end(req.body.username) // pro_gamer
```

### What is "parsec"?

The parsec (symbol: pc) is a unit of length used to measure large distances to astronomical objects outside the Solar System.
