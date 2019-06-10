import { IncomingMessage as Req } from 'http'
import { parse } from 'querystring'

// Extend the request object with body
declare interface ReqWithBody extends Req {
  body: string
}

// Main function
const parsec = (req: ReqWithBody, fn?: Function) => {
  return new Promise((resolve: Function) => {
    req.body = ''
    req
      // When new data is coming from request
      .on('data', (chunk: Array<any>) => (req.body += chunk.toString()))
      // We got all the data, now let's format it!
      .on('end', () => {
        if (fn) req.body = fn(req.body)
        resolve(req.body)
      })
  })
}

// JSON, raw, FormData

const json = (req: ReqWithBody) => parsec(req, JSON.parse)
const raw = (req: ReqWithBody) => parsec(req)
const form = (req: ReqWithBody) => parsec(req, parse)

export { parsec as custom, json, raw, form }
