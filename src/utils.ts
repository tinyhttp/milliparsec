import type { IncomingMessage } from 'node:http'
import type { ParserOptions } from './types.js'

export const hasBody = (method: string): boolean => ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)

export const checkType = (req: IncomingMessage, type: ParserOptions['type']): boolean => {
  if (typeof type === 'string') return type === req.headers['content-type']?.split(';')[0]
  if (typeof type === 'function') return type(req)
  return true
}
