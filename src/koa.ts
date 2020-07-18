import * as parsec from './index'
import {
  Response,
  Next,
  ParameterizedContext,
  DefaultState,
  DefaultContext,
} from 'koa'
import { IncomingMessage, ServerResponse } from 'http'
import * as qs from 'querystring'

export type CtxWithBody = ParameterizedContext<DefaultState, DefaultContext> & {
  req: IncomingMessage & {
    body: any
  }
}

const custom = (fn = (body: any) => body) => (ctx: CtxWithBody, next?: Next) => {
  parsec.custom(fn, Request)(ctx.req, ctx.res, next)
}

const json = () => (ctx: CtxWithBody, next?: Next) => {
  return parsec.custom((x) => JSON.parse(x.toString()))(ctx.req, ctx.res, next)
}

const raw = () => (ctx: CtxWithBody, next?: Next) => {
  return parsec.custom((x) => x)(ctx.req, ctx.res, next)
}

const text = () => (ctx: CtxWithBody, next?: Next) => {
  return parsec.custom((x) => x.toString())(ctx.req, ctx.res, next)
}

const form = () => (ctx: CtxWithBody, next?: Next) => {
  return parsec.custom((x) => qs.parse(x.toString()))(ctx.req, ctx.res, next)
}

export { custom, json, raw, text, form }
