# parsec 🌌

![Twitter](https://img.shields.io/twitter/follow/v1rtl.svg?label=twitter&style=flat-square)
![Top lang](https://img.shields.io/github/languages/top/talentlessguy/parsec.svg?style=flat-square)
![Vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/body-parsec.svg?style=flat-square)
![Version](https://img.shields.io/npm/v/body-parsec.svg?style=flat-square)
![Last commit](https://img.shields.io/github/last-commit/talentlessguy/parsec.svg?style=flat-square)
![Minified size](https://img.shields.io/bundlephobia/min/body-parsec.svg?style=flat-square)

Modern asynchronous body parser for Node.js.

It puts all the data into `req.body` so you don't have to create a separate array for it. At the same time, you can get the parsed body as a resolver argument.

## Features 🛠

- async ⌛
- JSON / raw / form / text data support ⏩
- tiny package size (766 b) 📦
- no dependencies 🔥
- filter requests (only POST, PUT and PATCH) ☔
- Koa & Express support

### TODO 🚩

- [ ] XML support
- [ ] Multipart support

## Installation 🔄

```sh
yarn add body-parsec
# or
npm i body-parsec
```

## Usage ⏩

### Basic example 🖐

- All the examples are located in `examples` directory. To run an example, clone the repository, then run `yarn build` and then `yarn run:` + filename of the example.

Use a middleware inside a server:

```js
import { createServer } = from 'http'
import * as parsec from 'body-parsec'

createServer(async (req, res) => {
  const parsedData = await parsec.json()(req)
  console.log(parsedData) // { 'hello': 'world' }
  res.setHeader('Content-Type', 'application/json')
  res.end(req.body.hello)
}).listen(80)
```

Then try to make a request to our server:

```sh
curl -d '{ "hello": "world" }' localhost
```

After sending a request, it should output `world`.

### Parsec and web frameworks ⚙

## Express

```js
import Express from 'express'
import { form } from 'body-parsec'

const app = Express()

app.use(form())

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
```

## Koa

```ts
import Koa from 'koa'
import { json, CtxWithBody } from 'body-parsec/koa'

const app = new Koa()

app.use(json())

app.use((ctx: CtxWithBody) => {
  if (ctx.method === 'POST') {
    ctx.type = 'application/json'
    ctx.body = ctx.req.body
  }
})
```

### Docs 📖

#### `parsec.raw(req)`

Minimal body parsing without any formatting (even without converting to string):

```js
// Request: curl -d "Hello World"
await parsec.raw()(req)
res.end(req.body) // "Hello World"
```

#### `parsec.text(req)`

Converts request body to string.

```js
// Request: curl -d "Hello World"
await parsec.text()(req)
res.end(req.body) // "Hello World"
```

#### `parsec.custom(req, fn)`

You can use `parsec` as a a handler for `IncomingMessage` with a custom formatter.

Here we make a request body upper case:

```js
// Request: curl -d "this text must be uppercased" localhost
await parsec.custom(req, (data) => data.toUpperCase())
res.end(req.body) // "THIS TEXT MUST BE UPPERCASED"
```

#### `parsec.json(req)`

If you need to parse a JSON request simply use `parsec.json` method:

```js
// Request: curl -d { "hello": "world" } localhost
await parsec.json()(req)
res.end(req.body.hello) // world
```

#### `parsec.form(req)`

Body parsers are mostly used to get data from forms. To get data from them, use `form` method:
You can try to play with HTML form example in

```js
// Request: curl -d 'username=pro_gamer'
await parsec.form()(req)
res.end(req.body.username) // pro_gamer
```

### What is "parsec"?

The parsec (symbol: pc) is a unit of length used to measure large distances to astronomical objects outside the Solar System.
