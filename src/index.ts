import { ServerResponse as Response, IncomingMessage, STATUS_CODES } from 'http'
import * as qs from 'querystring'
import { EventEmitter } from 'events'

type NextFunction = (err?: any) => void

// Extend the request object with body
export type ReqWithBody<T = any> = IncomingMessage & {
  body?: T
} & EventEmitter

export const hasBody = (method: string) => ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)

// Main function
export const p =
  <T = any>(fn: (body: any) => any) =>
  async (req: ReqWithBody<T>, _res: Response, next: (err?: any) => void) => {
    try {
      let body = ''

      for await (const chunk of req) body += chunk

      return fn(body)
    } catch (e) {
      next(e)
    }
  }

// JSON, raw, FormData

const custom =
  <T = any>(fn: (body: any) => any) =>
  async (req: ReqWithBody, _res: Response, next: NextFunction) => {
    req.body = await p<T>(fn)(req, undefined, next)
    next()
  }

const json = () => async (req: ReqWithBody, res: Response, next: NextFunction) => {
  if (hasBody(req.method)) {
    req.body = await p((x) => JSON.parse(x.toString()))(req, res, next)
    next()
  } else next()
}

const raw = () => async (req: ReqWithBody, _res: Response, next: NextFunction) => {
  if (hasBody(req.method)) req.body = await p((x) => x)(req, _res, next)
  else next()
}

const text = () => async (req: ReqWithBody, _res: Response, next: NextFunction) => {
  if (hasBody(req.method)) req.body = await p((x) => x.toString())(req, _res, next)
  else next()
}

const urlencoded = () => async (req: ReqWithBody, res: Response, next: NextFunction) => {
  if (hasBody(req.method)) {
    req.body = await p((x) => qs.parse(x.toString()))(req, res, next)
    next()
  } else next()
}

export { custom, json, raw, text, urlencoded }
