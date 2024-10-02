import type { EventEmitter } from 'node:events'
import type { IncomingMessage, ServerResponse as Response } from 'node:http'

type NextFunction = (err?: any) => void

// Extend the request object with body
export type ReqWithBody<T = any> = IncomingMessage & {
  body?: T
} & EventEmitter

export const hasBody = (method: string) => ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)

const defaultPayloadLimit = 104857600 // 100KB

export type LimitErrorFn = (limit: number) => string

export type ParserOptions = Partial<{
  limit: number
  errorFn: LimitErrorFn
}>

const defaultErrorFn: LimitErrorFn = (limit) => `Payload too large. Limit: ${limit} bytes`

// Main function
export const p =
  <T = any>(fn: (body: any) => any, limit = defaultPayloadLimit, errorFn: LimitErrorFn = defaultErrorFn) =>
    async (req: ReqWithBody<T>, _res: Response, next: (err?: any) => void) => {
      try {
        let body = ''

        for await (const chunk of req) {
          if (body.length > limit) throw new Error(errorFn(limit))
          body += chunk
        }

        return fn(body)
      } catch (e) {
        next(e)
      }
    }

const custom =
  <T = any>(fn: (body: any) => any) =>
    async (req: ReqWithBody, _res: Response, next: NextFunction) => {
      if (hasBody(req.method!)) req.body = await p<T>(fn)(req, _res, next)
      next()
    }

const json =
  ({ limit, errorFn }: ParserOptions = {}) =>
    async (req: ReqWithBody, res: Response, next: NextFunction) => {
      if (hasBody(req.method!)) {
        req.body = await p((x) => (x ? JSON.parse(x.toString()) : {}), limit, errorFn)(req, res, next)
      } else next()
    }

const raw =
  ({ limit, errorFn }: ParserOptions = {}) =>
    async (req: ReqWithBody, _res: Response, next: NextFunction) => {
      if (hasBody(req.method!)) {
        req.body = await p((x) => x, limit, errorFn)(req, _res, next)
      } else next()
    }

const text =
  ({ limit, errorFn }: ParserOptions = {}) =>
    async (req: ReqWithBody, _res: Response, next: NextFunction) => {
      if (hasBody(req.method!)) {
        req.body = await p((x) => x.toString(), limit, errorFn)(req, _res, next)
      } else next()
    }

const urlencoded =
  ({ limit, errorFn }: ParserOptions = {}) =>
    async (req: ReqWithBody, _res: Response, next: NextFunction) => {
      if (hasBody(req.method!)) {
        req.body = await p(
          (x) => {
            const urlSearchParam = new URLSearchParams(x.toString())
            return Object.fromEntries(urlSearchParam.entries())
          },
          limit,
          errorFn
        )(req, _res, next)
      } else next()
    }

const getBoundary = (contentType: string) => {
  // Extract the boundary from the Content-Type header
  const match = /boundary=(.+);?/.exec(contentType)
  return match ? `--${match[1]}` : null
}

const parseMultipart = (body: string, boundary: string, { fileCountLimit }: MultipartOptions) => {
  // Split the body into an array of parts
  const parts = body.split(new RegExp(`${boundary}(--)?`)).filter((part) => !!part && /content-disposition/i.test(part))
  const parsedBody: Record<string, (File | string)[]> = {}

  if (fileCountLimit && parts.length > fileCountLimit) throw new Error(`Too many files. Limit: ${fileCountLimit}`)

  // Parse each part into a form data object
  // biome-ignore lint/complexity/noForEach: <explanation>
  parts.forEach((part) => {
    const [headers, ...lines] = part.split('\r\n').filter((part) => !!part)
    const data = lines.join('\r\n').trim()

    // Extract the name and filename from the headers
    const name = /name="(.+?)"/.exec(headers)![1]
    const filename = /filename="(.+?)"/.exec(headers)
    if (filename) {
      const contentTypeMatch = /Content-Type: (.+)/i.exec(data)!
      const fileContent = data.slice(contentTypeMatch[0].length + 2)

      const file = new File([fileContent], filename[1], { type: contentTypeMatch[1] })

      parsedBody[name] = parsedBody[name] ? [...parsedBody[name], file] : [file]
      return
    }
    // This is a regular field
    parsedBody[name] = parsedBody[name] ? [...parsedBody[name], data] : [data]
    return
  })

  return parsedBody
}
type MultipartOptions = Partial<{
  fileCountLimit: number
  fileSizeLimit: number
}>

const multipart =
  ({ limit, errorFn, ...opts }: MultipartOptions & ParserOptions = {}) =>
    async (req: ReqWithBody, res: Response, next: NextFunction) => {
      if (hasBody(req.method!)) {
        req.body = await p((x) => {
          const boundary = getBoundary(req.headers['content-type']!)
          if (boundary) return parseMultipart(x, boundary, opts)
        }, limit, errorFn)(req, res, next)
        next()
      } else next()
    }

export { custom, json, raw, text, urlencoded, multipart }
