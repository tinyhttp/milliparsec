import { ServerResponse as Response, IncomingMessage } from 'http'
import * as qs from 'querystring'
import { once, EventEmitter } from 'events'

type NextFunction = (err?: any) => void

// Extend the request object with body
export type ReqWithBody = IncomingMessage & {
  body?: any
} & EventEmitter

// Main function
const parsec = <T extends ReqWithBody>(fn: (body: any) => void) => async (
  req: ReqWithBody | T,
  _res: Response,
  next: (err?: any) => void
) => {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    try {
      let body = ''

      for await (const chunk of req) {
        body += chunk
      }

      req.body = fn(body)
    } catch (e) {
      next(e)
    }
  }
  next()
}

// JSON, raw, FormData

const json = () => async (req: ReqWithBody, _res: Response, next: NextFunction) => {
  await parsec((x) => JSON.parse(x.toString()))(req, _res, next)
}

const raw = () => async (req: ReqWithBody, _res: Response, next: NextFunction) => {
  await parsec((x) => x)(req, _res, next)
}

const text = () => async (req: ReqWithBody, _res: Response, next: NextFunction) => {
  await parsec((x) => x.toString())(req, _res, next)
}

const urlencoded = () => async (req: ReqWithBody, _res: Response, next: NextFunction) => {
  await parsec((x) => qs.parse(x.toString()))(req, _res, next)
}

export { parsec as custom, json, raw, text, urlencoded }
