<div align="center">
<br /><br /><br />
<img src="logo.png" width="400px" />
<br /><br />

[![Version][v-badge-url]][npm-url] [![Coverage][cov-img]][cov-url]
[![Github actions][gh-actions-img]][github-actions]
[![Downloads][dl-badge-url]][npm-url]

</div>
<br />

Tiniest body parser in the universe. Built for modern Node.js.

Check out [deno-libs/parsec](https://github.com/deno-libs/parsec) for Deno port.

## Features

- 🛠 JSON / raw / urlencoded / multipart support
- 📦 tiny package size (8KB dist size)
- 🔥 no dependencies
- ✨ [tinyhttp](https://github.com/tinyhttp/tinyhttp) and Express support
- ⚡ 40% faster than body-parser and 20x faster than formidable

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
  await json()(req, res, (err) => void err && res.end(err))

  res.setHeader('Content-Type', 'application/json')

  res.end(JSON.stringify(req.body))
})
```

### What is "parsec"?

The parsec is a unit of length used to measure large distances to astronomical
objects outside the Solar System.

[v-badge-url]: https://img.shields.io/npm/v/milliparsec.svg?style=for-the-badge&color=25608B&logo=npm&label=
[npm-url]: https://www.npmjs.com/package/milliparsec
[dl-badge-url]: https://img.shields.io/npm/dt/milliparsec?style=for-the-badge&color=25608B
[github-actions]: https://github.com/talentlessguy/milliparsec/actions
[gh-actions-img]: https://img.shields.io/github/actions/workflow/status/tinyhttp/milliparsec/main.yml?branch=master&style=for-the-badge&color=25608B&label=&logo=github
[cov-img]: https://img.shields.io/coveralls/github/tinyhttp/milliparsec?style=for-the-badge&color=25608B
[cov-url]: https://coveralls.io/github/tinyhttp/milliparsec
