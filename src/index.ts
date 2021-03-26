import { ServerResponse as Response, IncomingMessage, STATUS_CODES } from 'http'
import * as qs from 'querystring'
import { once, EventEmitter } from 'events'

type NextFunction = (err?: any) => void

// Extend the request object with body
export type ReqWithBody<T = any> = IncomingMessage & {
  body?: T
} & EventEmitter

// Main function
export const p = <T = any>(fn: (body: any) => any) => async (
  req: ReqWithBody<T>,
  _res: Response,
  next: (err?: any) => void
) => {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    try {
      let body = ''

      for await (const chunk of req) body += chunk

      return fn(body)
    } catch (e) {
      next(e)
    }
  }
}

// JSON, raw, FormData

const custom = <T = any>(fn: (body: any) => any) => async (req: ReqWithBody, _res: Response, next: NextFunction) => {
  req.body = await p<T>(fn)(req, undefined, next)
  next()
}

const json = () => async (req: ReqWithBody, res: Response, next: NextFunction) => {
  if (req.headers['content-type'] === 'application/json') {
    req.body = await p((x) => JSON.parse(x.toString()))(req, res, next)
    next()
  } else {
    res.writeHead(415).end(STATUS_CODES[415])
  }
}

const raw = () => async (req: ReqWithBody, _res: Response, next: NextFunction) =>
  (req.body = await p((x) => x)(req, _res, next))

const text = () => async (req: ReqWithBody, _res: Response, next: NextFunction) =>
  (req.body = await p((x) => x.toString())(req, _res, next))

const urlencoded = () => async (req: ReqWithBody, res: Response, next: NextFunction) => {
  if (req.headers['content-type'] === 'application/x-www-form-urlencoded') {
    req.body = await p((x) => qs.parse(x.toString()))(req, res, next)
    next()
  } else {
    res.writeHead(415).end(STATUS_CODES[415])
  }
}

export { custom, json, raw, text, urlencoded }
