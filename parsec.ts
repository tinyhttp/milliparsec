import { IncomingMessage as Req } from 'http'
import { parse } from 'querystring'

declare interface ReqWithBody extends Req {
  body: string
}

const parsec = (req: ReqWithBody, fn?: Function) => {
  return new Promise((resolve: Function) => {
    req.body = ''
    req
      .on('data', (chunk: Array<any>) => (req.body += chunk.toString()))
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
