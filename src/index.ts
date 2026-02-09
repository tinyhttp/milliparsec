import { Buffer, File } from 'node:buffer'
import type { ServerResponse as Response } from 'node:http'
import type { LimitErrorFn, NextFunction, ParserOptions, ReqWithBody } from './types.ts'
import { checkType, hasBody } from './utils.ts'

export * from './types.ts'

const defaultPayloadLimit = 102400 // 100KiB

const defaultErrorFn: LimitErrorFn = (payloadLimit) => new Error(`Payload too large. Limit: ${payloadLimit} bytes`)

// Main function
export const p =
  <T = any>(
    fn: (body: Buffer, req: ReqWithBody<T>) => void,
    payloadLimit = defaultPayloadLimit,
    payloadLimitErrorFn: LimitErrorFn = defaultErrorFn
  ) =>
  (req: ReqWithBody<T>, _res: Response, next?: (err?: any) => void): Promise<T | undefined> =>
    new Promise((resolve) => {
      const body: Buffer[] = []
      let totalSize = 0

      req.on('data', (chunk: Buffer) => {
        totalSize += chunk.byteLength
        if (totalSize > payloadLimit) {
          req.removeAllListeners()
          next?.(payloadLimitErrorFn(payloadLimit))
          resolve(undefined)
        } else {
          body.push(chunk)
        }
      })

      req.on('end', () => {
        try {
          resolve(fn(body.length === 1 ? body[0] : Buffer.concat(body), req) as T)
        } catch (e) {
          next?.(e)
          resolve(undefined)
        }
      })

      req.on('error', (err: Error) => {
        next?.(err)
        resolve(undefined)
      })
    })

/**
 * Parse payload with a custom function
 * @param fn
 */
const custom = <T = any>(fn: (body: Buffer) => any, type?: ParserOptions['type']) => {
  const parse = p<T>(fn)
  return async (req: ReqWithBody, _res: Response, next?: NextFunction) => {
    if (hasBody(req.method!) && checkType(req, type)) req.body = await parse(req, _res, next)
    next?.()
  }
}

/**
 * Parse JSON payload
 * @param options
 */
const json = ({
  payloadLimit,
  payloadLimitErrorFn,
  type,
  reviver
}: ParserOptions<{
  reviver?: (this: any, key: string, value: any) => any
}> = {}) => {
  const parse = p((x) => (x.length === 0 ? {} : JSON.parse(x.toString(), reviver)), payloadLimit, payloadLimitErrorFn)
  return async (req: ReqWithBody, res: Response, next?: NextFunction) => {
    if (hasBody(req.method!) && checkType(req, type)) {
      req.body = await parse(req, res, next)
    }
    next?.()
  }
}

/**
 * Parse raw payload
 * @param options
 */
const raw = ({ payloadLimit, payloadLimitErrorFn, type }: ParserOptions = {}) => {
  const parse = p((x) => x, payloadLimit, payloadLimitErrorFn)
  return async (req: ReqWithBody, _res: Response, next?: NextFunction) => {
    if (hasBody(req.method!) && checkType(req, type)) {
      req.body = await parse(req, _res, next)
    }
    next?.()
  }
}

/**
 * Stringify request payload
 * @param param0
 * @returns
 */
const text = ({ payloadLimit, payloadLimitErrorFn, type }: ParserOptions = {}) => {
  const parse = p((x) => x.toString(), payloadLimit, payloadLimitErrorFn)
  return async (req: ReqWithBody, _res: Response, next?: NextFunction) => {
    if (hasBody(req.method!) && checkType(req, type)) {
      req.body = await parse(req, _res, next)
    }
    next?.()
  }
}

const td = new TextDecoder()

/**
 * Parse urlencoded payload
 * @param options
 */
const urlencoded = ({ payloadLimit, payloadLimitErrorFn, type }: ParserOptions = {}) => {
  const parse = p(
    (x) => Object.fromEntries(new URLSearchParams(x.toString()).entries()),
    payloadLimit,
    payloadLimitErrorFn
  )
  return async (req: ReqWithBody, _res: Response, next?: NextFunction) => {
    if (hasBody(req.method!) && checkType(req, type)) {
      req.body = await parse(req, _res, next)
    }
    next?.()
  }
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

      ;(parsedBody[name] ??= []).push(file)
      return
    }
    ;(parsedBody[name] ??= []).push(data)
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
const multipart = ({
  payloadLimit = Number.POSITIVE_INFINITY,
  payloadLimitErrorFn,
  type,
  ...opts
}: MultipartOptions & ParserOptions = {}) => {
  const parse = p(
    (x, req) => {
      const boundary = getBoundary(req.headers['content-type']!)
      if (boundary) return parseMultipart(td.decode(x), boundary, opts)
      return {}
    },
    payloadLimit,
    payloadLimitErrorFn
  )
  return async (req: ReqWithBody, res: Response, next?: NextFunction) => {
    if (hasBody(req.method!) && checkType(req, type)) {
      req.body = await parse(req, res, next)
    }
    next?.()
  }
}

export { custom, json, raw, text, urlencoded, multipart }
