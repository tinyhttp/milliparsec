import { Buffer } from 'node:buffer'
import type { ServerResponse as Response } from 'node:http'
import type { LimitErrorFn, NextFunction, ParserOptions, ReqWithBody } from './types.js'
import { checkType, hasBody } from './utils.js'

export * from './types.js'

const defaultPayloadLimit = 102400 // 100KiB

const defaultErrorFn: LimitErrorFn = (payloadLimit) => new Error(`Payload too large. Limit: ${payloadLimit} bytes`)

// Main function
export const p =
  <T = any>(
    fn: (body: Buffer) => void,
    payloadLimit = defaultPayloadLimit,
    payloadLimitErrorFn: LimitErrorFn = defaultErrorFn
  ) =>
  async (req: ReqWithBody<T>, _res: Response, next?: (err?: any) => void) => {
    try {
      const body: Buffer[] = []

      for await (const chunk of req) {
        const totalSize = body.reduce((total, buffer) => total + buffer.byteLength, 0)
        if (totalSize > payloadLimit) throw payloadLimitErrorFn(payloadLimit)
        body.push(chunk as Buffer)
      }

      return fn(Buffer.concat(body))
    } catch (e) {
      next?.(e)
    }
  }

/**
 * Parse payload with a custom function
 * @param fn
 */
const custom =
  <T = any>(fn: (body: Buffer) => any, type?: ParserOptions['type']) =>
  async (req: ReqWithBody, _res: Response, next?: NextFunction) => {
    if (hasBody(req.method!) && checkType(req, type)) req.body = await p<T>(fn)(req, _res, next)
    next?.()
  }

/**
 * Parse JSON payload
 * @param options
 */
const json =
  ({
    payloadLimit,
    payloadLimitErrorFn,
    type,
    reviver
  }: ParserOptions<{
    reviver?: (this: any, key: string, value: any) => any
  }> = {}) =>
  async (req: ReqWithBody, res: Response, next?: NextFunction) => {
    if (hasBody(req.method!) && checkType(req, type)) {
      req.body = await p(
        (x) => {
          const str = td.decode(x)
          return str ? JSON.parse(str, reviver) : {}
        },
        payloadLimit,
        payloadLimitErrorFn
      )(req, res, next)
    }
    next?.()
  }

/**
 * Parse raw payload
 * @param options
 */
const raw =
  ({ payloadLimit, payloadLimitErrorFn, type }: ParserOptions = {}) =>
  async (req: ReqWithBody, _res: Response, next?: NextFunction) => {
    if (hasBody(req.method!) && checkType(req, type)) {
      req.body = await p((x) => x, payloadLimit, payloadLimitErrorFn)(req, _res, next)
    }
    next?.()
  }

const td = new TextDecoder()
/**
 * Stringify request payload
 * @param param0
 * @returns
 */
const text =
  ({ payloadLimit, payloadLimitErrorFn, type }: ParserOptions = {}) =>
  async (req: ReqWithBody, _res: Response, next?: NextFunction) => {
    if (hasBody(req.method!) && checkType(req, type)) {
      req.body = await p((x) => td.decode(x), payloadLimit, payloadLimitErrorFn)(req, _res, next)
    }
    next?.()
  }

/**
 * Parse urlencoded payload
 * @param options
 */
const urlencoded =
  ({ payloadLimit, payloadLimitErrorFn, type }: ParserOptions = {}) =>
  async (req: ReqWithBody, _res: Response, next?: NextFunction) => {
    if (hasBody(req.method!) && checkType(req, type)) {
      req.body = await p(
        (x) => Object.fromEntries(new URLSearchParams(x.toString()).entries()),
        payloadLimit,
        payloadLimitErrorFn
      )(req, _res, next)
    }
    next?.()
  }

const getBoundary = (contentType: string) => {
  const match = /boundary=(.+);?/.exec(contentType)
  return match ? `--${match[1]}` : null
}

const defaultFileSizeLimitErrorFn: LimitErrorFn = (limit) => new Error(`File too large. Limit: ${limit} bytes`)

const defaultFileSizeLimit = 200 * 1024 * 1024 // 200MiB

const parseMultipart = (
  body: string,
  boundary: string,
  {
    fileCountLimit,
    fileSizeLimit = defaultFileSizeLimit,
    fileSizeLimitErrorFn = defaultFileSizeLimitErrorFn
  }: MultipartOptions
) => {
  const parts = body.split(new RegExp(`${boundary}(--)?`)).filter((part) => !!part && /content-disposition/i.test(part))
  const parsedBody: Record<string, (File | string)[]> = {}

  if (fileCountLimit && parts.length > fileCountLimit) throw new Error(`Too many files. Limit: ${fileCountLimit}`)

  parts.forEach((part) => {
    const [headers, ...lines] = part.split('\r\n').filter((part) => !!part)
    const data = lines.join('\r\n').trim()

    if (data.length > fileSizeLimit) throw fileSizeLimitErrorFn(fileSizeLimit)

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
    parsedBody[name] = parsedBody[name] ? [...parsedBody[name], data] : [data]
    return
  })

  return parsedBody
}
type MultipartOptions = Partial<{
  /**
   * Limit number of files
   */
  fileCountLimit: number
  /**
   * Limit file size (in bytes)
   */
  fileSizeLimit: number
  /**
   * Custom error function for file size limit
   */
  fileSizeLimitErrorFn: LimitErrorFn
}>
/**
 * Parse multipart form data (supports files as well)
 *
 * Does not restrict total payload size by default.
 * @param options
 */
const multipart =
  ({
    payloadLimit = Number.POSITIVE_INFINITY,
    payloadLimitErrorFn,
    type,
    ...opts
  }: MultipartOptions & ParserOptions = {}) =>
  async (req: ReqWithBody, res: Response, next?: NextFunction) => {
    if (hasBody(req.method!) && checkType(req, type)) {
      req.body = await p(
        (x) => {
          const boundary = getBoundary(req.headers['content-type']!)
          if (boundary) return parseMultipart(td.decode(x), boundary, opts)
          return {}
        },
        payloadLimit,
        payloadLimitErrorFn
      )(req, res, next)
    }
    next?.()
  }

export { custom, json, raw, text, urlencoded, multipart }
