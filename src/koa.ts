import * as parsec from './index'
import {
  Response,
  Next,
  ParameterizedContext,
  DefaultState,
  DefaultContext,
} from 'koa'
import { IncomingMessage } from 'http'
import { parse } from 'querystring'

export type CtxWithBody = ParameterizedContext<DefaultState, DefaultContext> & {
  req: IncomingMessage & {
    body: any
  }
}

const custom = (fn = (body: any) => body) => (
  req: IncomingMessage,
  _: Response,
  next: Next
) => {
  parsec.custom(fn, Request)(req, next)
}

const json = () => (ctx: CtxWithBody, next: Next) => {
  return parsec.custom((x) => JSON.parse(x.toString()))(ctx.req, next)
}

const raw = () => (ctx: CtxWithBody, next: Next) => {
  return parsec.custom((x) => x)(ctx.req, next)
}

const text = () => (ctx: CtxWithBody, next: Next) => {
  return parsec.custom((x) => x.toString())(ctx.req, next)
}

const form = () => (ctx: CtxWithBody, next: Next) => {
  return parsec.custom((x) => parse(x.toString()))(ctx.req, next)
}

export { custom, json, raw, text, form }
