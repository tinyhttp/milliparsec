import { IncomingMessage } from 'http'

declare module 'body-parsec' {
  export function raw(req: IncomingMessage): any
  export function form(req: IncomingMessage): any
  export function json(req: IncomingMessage): any

  export interface ReqWithBody extends Req {
    body: string
  }
}
