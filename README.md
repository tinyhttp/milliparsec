# parsec 🌌

Small &amp; cool asynchronous body parser for Node.js.

It puts all the data into `req.body` so you don't have to create a separate array for it.

## Features 🛠

- async
- JSON / raw / form data support
- tiny package size (488 b)

### TODO 🚩

- [ ] XML
- [ ] Add Express and Koa examples

## Installation 🔄

```sh
yarn add body-parsec
# or
npm i body-parsec
```

## Usage

### Basic example 🖐

- All the examples are located in `examples` directory.

Use a middleware inside a server:

```js
const { createServer } = require('http')
const parsec = require('body-parsec')

createServer(async (req, res) => {
  await parsec.json(req)
  res.setHeader('Content-Type', 'application/json')
  res.end(req.body.hello)
}).listen(80)
```

If you don't like async / await syntax, you can simply use `.then`:

```js
const { createServer } = require('http')
const parsec = require('body-parsec')

createServer((req, res) => {
  parsec.json(req).then(() => {
    res.setHeader('Content-Type', 'application/json')
    res.end(req.body.hello)
  })
}).listen(80)
```

Then try to make a request to our server:

```sh
curl -d '{ "hello": "world" }' localhost
```

After sending a request, it should output `world`.

### Docs 📖

#### `parsec.raw(req)`

Minimal body parsing without any formatting:

```js
// Request: curl -d "Hello World"
await parsec.raw(req)
res.end(req.body) // "Hello World:
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
