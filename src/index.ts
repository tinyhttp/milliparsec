import { IncomingMessage as Req, ServerResponse as Response } from 'http'
import * as qs from 'querystring'
import { once } from 'events'

// Extend the request object with body
export type ReqWithBody = Req & {
  body?: any
}

// Main function
const parsec = (fn: (body: any) => void, T?: any) => async (req: ReqWithBody | typeof T, _res: Response, next?: () => void) => {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const chunk = await once(req, 'data')

    req.body = ''

    req.body += chunk

    req.body = fn(req.body)
  }
  next?.()
}

// JSON, raw, FormData

const json = () => (req: ReqWithBody, _res?: Response, next?: () => void) => {
  return parsec((x) => JSON.parse(x.toString()))(req, _res, next)
}

const raw = () => (req: ReqWithBody, _res?: Response, next?: () => void) => {
  return parsec((x) => x)(req, _res, next)
}

const text = () => (req: ReqWithBody, _res?: Response, next?: () => void) => {
  return parsec((x) => x.toString())(req, _res, next)
}

const form = () => (req: ReqWithBody, _res?: Response, next?: () => void) => {
  return parsec((x) => qs.parse(x))(req, _res, next)
}

export { parsec as custom, json, raw, text, form }
