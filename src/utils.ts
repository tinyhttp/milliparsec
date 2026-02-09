import type { IncomingMessage } from 'node:http'
import type { ParserOptions } from './types.ts'

export const hasBody = (method: string): boolean => ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)

export const checkType = (req: IncomingMessage, type: ParserOptions['type']): boolean =>
  typeof type === 'function' ? type(req) : true
