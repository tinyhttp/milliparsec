import { IncomingMessage as Req } from 'http'
import { parse } from 'querystring'

// Extend the request object with body
declare interface ReqWithBody extends Req {
  body: string
}

// Main function
const parsec = (req: ReqWithBody, fn = (body: any) => body, next: Function) => {
  return new Promise((resolve: Function) => {
    req.body = ''
    if (!['POST', 'PUT', 'PATCH'].includes(req.method)) {
      next()
      // TODO: Add smth to finish request
    } else {
      req
        // When new data is coming from request
        .on('data', (chunk: Array<any>) => (req.body += chunk))
        // We got all the data, now let's format it!
        .on('end', () => {
          fn(req.body)
          resolve(req.body)
          if (next) next()
        })
    }
  })
}

// JSON, raw, FormData

const json = (req: ReqWithBody, next?: Function) => {
  return parsec(req, (x: any) => JSON.parse(x.toString()), next)
}

const raw = (req: ReqWithBody, next?: Function) => {
  return parsec(req, (x: any) => x, next)
}

const text = (req: ReqWithBody, next?: Function) => {
  return parsec(req, (x: any) => x.toString(), next)
}

const form = (req: ReqWithBody, next?: Function) => {
  return parsec(req, (x: any) => parse(x.toString()), next)
}

export { parsec as custom, json, raw, text, form }
