import { custom } from './index'
import { Next, ParameterizedContext, DefaultState, DefaultContext } from 'koa'
import { IncomingMessage } from 'http'
import * as qs from 'querystring'

export type CtxWithBody<T = any> = ParameterizedContext<DefaultState, DefaultContext> & {
  req: IncomingMessage & {
    body: T
  }
}

const p = (fn = (body: any) => body) => async (ctx: CtxWithBody, next: Next) => await custom(fn)(ctx.req, ctx.res, next)

const json = () => async (ctx: CtxWithBody, next: Next) => await p((x) => JSON.parse(x.toString()))(ctx, next)

const raw = () => async (ctx: CtxWithBody, next: Next) => await p((x) => x)(ctx, next)

const text = () => async (ctx: CtxWithBody, next: Next) => await p((x) => x.toString())(ctx, next)

const urlencoded = () => async (ctx: CtxWithBody, next: Next) => await p((x) => qs.parse(x.toString()))(ctx, next)

export { p as custom, json, raw, text, urlencoded }
