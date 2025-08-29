import type { IncomingMessage } from 'node:http'

/**
 * Request extension with a body
 */
export type ReqWithBody<T = any> = IncomingMessage & {
  body?: T
}

export type LimitErrorFn = (limit: number) => Error

export type ParserOptions<T extends Record<string, any> = Record<string, any>> = Partial<{
  /**
   * Limit payload size (in bytes)
   * @default 102400
   */
  payloadLimit: number
  /**
   * Custom error function for payload limit
   */
  payloadLimitErrorFn: LimitErrorFn
  /**
   * Middleware content type
   */
  type: string | ((req: IncomingMessage) => boolean)
}> &
  T

export type NextFunction = (err?: any) => void
