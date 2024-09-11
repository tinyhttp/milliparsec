<div align="center">
<br /><br /><br />
<img src="logo.png" width="400px" />
<br /><br />

![Vulnerabilities][vulns-badge-url]
[![Version][v-badge-url]][npm-url] [![Coverage][cov-img]][cov-url] [![Github actions][gh-actions-img]][github-actions] [![Downloads][dl-badge-url]][npm-url]

</div>
<br />

Tiniest body parser in the universe. Built for modern Node.js.

Check out [deno-libs/parsec](https://github.com/deno-libs/parsec) for Deno port.

## Features

- ⏩ built with `async` / `await`
- 🛠 JSON / raw / urlencoded data support
- 📦 tiny package size (8KB dist size)
- 🔥 no dependencies
- ✨ [tinyhttp](https://github.com/tinyhttp/tinyhttp) and Express support
- ⚡ 30% faster than body-parser

## Install

```sh
# pnpm
pnpm i milliparsec

# bun
bun i milliparsec
```

## Usage

### Basic example

Use a middleware inside a server:

```js
import { createServer } from 'node:http'
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

## API

### `raw(req, res, cb)`

Minimal body parsing without any formatting.

### `text(req, res, cb)`

Converts request body to string.

### `urlencoded(req, res, cb)`

Parses request body using `new URLSearchParams`.

### `json(req, res, cb)`

Parses request body using `JSON.parse`.

### `multipart(req, res, cb)`

Parses request body using `multipart/form-data` content type and boundary. Supports files as well.

```js
// curl -F "textfield=textfield" -F "someother=textfield with text" localhost:3000
await multipart()(req, res, (err) => void err && console.log(err))
res.end(req.body) // { textfield: "textfield", someother: "textfield with text" }
```

### `custom(fn)(req, res, cb)`

Custom function for `parsec`.

```js
// curl -d "this text must be uppercased" localhost:3000
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
[dl-badge-url]: https://img.shields.io/npm/dt/milliparsec?style=for-the-badge&color=25608B
[github-actions]: https://github.com/talentlessguy/milliparsec/actions
[gh-actions-img]: https://img.shields.io/github/actions/workflow/status/tinyhttp/milliparsec/main.yml?branch=master&style=for-the-badge&color=25608B&label=&logo=github
[cov-img]: https://img.shields.io/coveralls/github/tinyhttp/milliparsec?style=for-the-badge&color=25608B
[cov-url]: https://coveralls.io/github/tinyhttp/milliparsec
