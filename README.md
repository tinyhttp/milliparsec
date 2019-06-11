# parsec 🌌

Asynchronous body parser for Node.js.

It puts all the data into `req.body` so you don't have to create a separate array for it. At the same time, you can get the parsed body as a resolver argument.

## Features 🛠

- async ⌛
- JSON / raw / form / text data support ⏩
- tiny package size (750 b) 📦
- no dependencies 🎊
- filter requests (only POST, PUT and PATCH) ☔

### TODO 🚩

- [ ] XML support
- [ ] Make an async / await wrapper for `await next()` for Koa

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
const { createServer } = require('http')
const { json } = require('body-parsec')

createServer(async (req, res) => {
  const parsedData = await json(req)
  console.log(parsedData) // { 'hello': 'world' }
  res.setHeader('Content-Type', 'application/json')
  res.end(req.body.hello)
}).listen(80)
```

If you don't like async / await syntax, you can simply use `.then`:

```js
const { createServer } = require('http')
const { json } = require('body-parsec')

createServer((req, res) => {
  json(req).then(parsedData => {
    res.setHeader('Content-Type', 'application/json')
    console.log(parsedData) // { 'hello': 'world' }
    res.end(req.body.hello)
  })
}).listen(80)
```

Then try to make a request to our server:

```sh
curl -d '{ "hello": "world" }' localhost
```

After sending a request, it should output `world`.

### Parsec and web frameworks ⚙

Parsec easily integrates with Express and Koa (because I haven't tested others yet). Here is a simple form handling with Express:

```js
import Express from 'express'
import { form } from 'body-parsec'

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
```

### Docs 📖

#### `parsec.raw(req)`

Minimal body parsing without any formatting (even without converting to string):

```js
// Request: curl -d "Hello World"
await parsec.raw(req)
res.end(req.body) // "Hello World"
```

#### `parsec.text(req)`

Converts request body to text.

```js
// Request: curl -d "Hello World"
await parsec.text(req)
res.end(req.body) // "Hello World"
```

#### `parsec.custom(req, fn)`

You can use `parsec` as a a handler for `IncomingMessage` with a custom formatter.

Here we make a request body upper case:

```js
// Request: curl -d "this text must be uppercased" localhost
await parsec.custom(req, data => data.toUpperCase())
res.end(req.body) // "THIS TEXT MUST BE UPPERCASED"
```

#### `parsec.json(req)`

If you need to parse a JSON request simply use `parsec.json` method:

```js
// Request: curl -d { "hello": "world" } localhost
await parsec.json(req)
res.end(req.body.hello) // world
```

#### `parsec.form(req)`

Body parsers are mostly used to get data from forms. To get data from them, use `form` method:
You can try to play with HTML form example in

```js
// Request: curl -d 'username=pro_gamer'
await parsec.form(req)
res.end(req.body.username) // pro_gamer
```

### What is "parsec"?

The parsec (symbol: pc) is a unit of length used to measure large distances to astronomical objects outside the Solar System.
