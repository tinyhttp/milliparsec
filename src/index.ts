import { IncomingMessage as Req } from 'http'
import { parse } from 'querystring'
import { EventEmitter } from 'events'

// promisify event
const pEvent = (emitter: EventEmitter, event: string) => {
  return new Promise((resolve) => {
    emitter.on(event, resolve)
  })
}

// Extend the request object with body
export interface ReqWithBody extends Req {
  body: string
}

// Main function
const parsec = (fn: (body: any) => void, T?: any) => async (
  req: ReqWithBody | typeof T,
  next?: () => void
) => {
  req.body = ''

  if (!['POST', 'PUT', 'PATCH'].includes(req.method)) {
    next()
  } else {
    const chunk = await pEvent(req, 'data')

    req.body += chunk

    await pEvent(req, 'end')
    req.body = fn(req.body)
    next?.()
  }
}

// JSON, raw, FormData

const json = () => (req: ReqWithBody, _: any, next?: () => void) => {
  return parsec((x) => JSON.parse(x.toString()))(req, next)
}

const raw = () => (req: ReqWithBody, _: any, next?: () => void) => {
  return parsec((x) => x)(req, next)
}

const text = () => (req: ReqWithBody, _: any, next?: () => void) => {
  return parsec((x) => x.toString())(req, next)
}

const form = () => (req: ReqWithBody, _: any, next?: () => void) => {
  return parsec((x) => parse(x.toString()))(req, next)
}

export { parsec as custom, json, raw, text, form }
