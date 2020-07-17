import { IncomingMessage as Req } from 'http'
import { parse } from 'querystring'
import { once } from 'events'

// Extend the request object with body
export type ReqWithBody = Req & {
  body?: any
}

// Main function
const parsec = (fn: (body: any) => void, T?: any) => async (
  req: ReqWithBody | typeof T,
  next?: () => void
) => {
  req.body = ''

  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const chunk = await once(req, 'data')

    req.body += chunk

    await once(req, 'end')
    req.body = fn(req.body)
  }
  next?.()
}

// JSON, raw, FormData

const json = () => (req: ReqWithBody, _?: any, next?: () => void) => {
  return parsec((x) => JSON.parse(x.toString()))(req, next)
}

const raw = () => (req: ReqWithBody, _?: any, next?: () => void) => {
  return parsec((x) => x)(req, next)
}

const text = () => (req: ReqWithBody, _?: any, next?: () => void) => {
  return parsec((x) => x.toString())(req, next)
}

const form = () => (req: ReqWithBody, _?: any, next?: () => void) => {
  return parsec((x) => parse(x.toString()))(req, next)
}

export { parsec as custom, json, raw, text, form }
