import { p as custom, hasBody } from './index'
import { STATUS_CODES } from 'http'
import { Next, ParameterizedContext, DefaultState, DefaultContext } from 'koa'
import * as qs from 'querystring'

export type CtxWithBody<T = any> = ParameterizedContext<
  DefaultState,
  DefaultContext & {
    parsedBody: T
  }
>

const p =
  (fn = (body: any) => body) =>
  async <T = any>(ctx: CtxWithBody<T>, next: Next) => {
    ctx.parsedBody = await custom(fn)(ctx.req, ctx.res, next)
    next()
  }

const json =
  () =>
  async <T = any>(ctx: CtxWithBody<T>, next: Next) => {
    if (hasBody(ctx.method)) {
      await p((x) => JSON.parse(x.toString()))<T>(ctx, next)
    } else next()
  }

const raw =
  () =>
  async <T = any>(ctx: CtxWithBody<T>, next: Next) => {
    if (hasBody(ctx.method)) await p((x) => x)<T>(ctx, next)
    else next()
  }

const text =
  () =>
  async <T = any>(ctx: CtxWithBody<T>, next: Next) => {
    if (hasBody(ctx.method)) await p((x) => x.toString())<T>(ctx, next)
    else next()
  }

const urlencoded =
  () =>
  async <T = any>(ctx: CtxWithBody, next: Next) => {
    if (hasBody(ctx.method)) {
      await p((x) => qs.parse(x.toString()))<T>(ctx, next)
    } else next()
  }

export { p as custom, json, raw, text, urlencoded }
