import { ServerResponse as Response, IncomingMessage } from 'http'
import * as qs from 'querystring'
import { once, EventEmitter } from 'events'

type NextFunction = (err?: any) => void

// Extend the request object with body
export type ReqWithBody<T = any> = IncomingMessage & {
  body?: T
} & EventEmitter

// Main function
const p = <T = any>(fn: (body: any) => any) => async (
  req: ReqWithBody<T>,
  _res: Response,
  next: (err?: any) => void
) => {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    try {
      let body = ''

      for await (const chunk of req) body += chunk

      req.body = fn(body)
    } catch (e) {
      next(e)
    }
  }
  next()
}

// JSON, raw, FormData

const json = () => async (req: ReqWithBody, _res: Response, next: NextFunction) =>
  await p((x) => JSON.parse(x.toString()))(req, _res, next)

const raw = () => async (req: ReqWithBody, _res: Response, next: NextFunction) => await p((x) => x)(req, _res, next)

const text = () => async (req: ReqWithBody, _res: Response, next: NextFunction) =>
  await p((x) => x.toString())(req, _res, next)

const urlencoded = () => async (req: ReqWithBody, _res: Response, next: NextFunction) =>
  await p((x) => qs.parse(x.toString()))(req, _res, next)

export { p as custom, json, raw, text, urlencoded }
