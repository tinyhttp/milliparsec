import type { IncomingMessage } from 'node:http'
import type { ParserOptions } from './types.ts'

const bodyMethods = new Set(['POST', 'PUT', 'PATCH', 'DELETE'])

export const hasBody = (method: string): boolean => bodyMethods.has(method)

export const checkType = (req: IncomingMessage, type: ParserOptions['type']): boolean =>
  typeof type === 'function' ? type(req) : true
