import * as parsec from './index'
import { Next, ParameterizedContext, DefaultState, DefaultContext } from 'koa'
import { IncomingMessage } from 'http'
import * as qs from 'querystring'

export type CtxWithBody = ParameterizedContext<DefaultState, DefaultContext> & {
  req: IncomingMessage & {
    body: any
  }
}

const custom = (fn = (body: any) => body) => async (ctx: CtxWithBody, next?: Next) => {
  await parsec.custom(fn)(ctx.req, ctx.res)
  next?.()
}

const json = () => async (ctx: CtxWithBody, next?: Next) => {
  await custom((x) => JSON.parse(x.toString()))(ctx)
  next?.()
}

const raw = () => async (ctx: CtxWithBody, next?: Next) => {
  await custom((x) => x)(ctx)
  next?.()
}

const text = () => async (ctx: CtxWithBody, next?: Next) => {
  await custom((x) => x.toString())(ctx)
  next?.()
}

const urlencoded = () => async (ctx: CtxWithBody, next?: Next) => {
  await custom((x) => qs.parse(x.toString()))(ctx)
  next?.()
}

export { custom, json, raw, text, urlencoded }
