import type { EventEmitter } from 'node:events'
import type { IncomingMessage, ServerResponse as Response } from 'node:http'

type NextFunction = (err?: any) => void

// Extend the request object with body
export type ReqWithBody<T = any> = IncomingMessage & {
  body?: T
} & EventEmitter

export const hasBody = (method: string) => ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)

// Main function
export const p =
  <T = any>(fn: (body: any) => any) =>
  async (req: ReqWithBody<T>, _res: Response, next: (err?: any) => void) => {
    try {
      let body = ''

      for await (const chunk of req) body += chunk

      return fn(body)
    } catch (e) {
      next(e)
    }
  }

const custom =
  <T = any>(fn: (body: any) => any) =>
  async (req: ReqWithBody, _res: Response, next: NextFunction) => {
    req.body = await p<T>(fn)(req, _res, next)
    next()
  }

const json = () => async (req: ReqWithBody, res: Response, next: NextFunction) => {
  if (hasBody(req.method!)) {
    req.body = await p((x) => (x ? JSON.parse(x.toString()) : {}))(req, res, next)
    next()
  } else next()
}

const raw = () => async (req: ReqWithBody, _res: Response, next: NextFunction) => {
  if (hasBody(req.method!)) {
    req.body = await p((x) => x)(req, _res, next)
    next()
  } else next()
}

const text = () => async (req: ReqWithBody, _res: Response, next: NextFunction) => {
  if (hasBody(req.method!)) {
    req.body = await p((x) => x.toString())(req, _res, next)
    next()
  } else next()
}

const urlencoded = () => async (req: ReqWithBody, res: Response, next: NextFunction) => {
  if (hasBody(req.method!)) {
    req.body = await p((x) => {
      const urlSearchParam = new URLSearchParams(x.toString())
      return Object.fromEntries(urlSearchParam.entries())
    })(req, res, next)
    next()
  } else next()
}

const getBoundary = (contentType: string) => {
  // Extract the boundary from the Content-Type header
  const match = /boundary=(.+);?/.exec(contentType)
  return match ? `--${match[1]}` : null
}

const parseMultipart = (body: string, boundary: string) => {
  // Split the body into an array of parts
  const parts = body.split(new RegExp(`${boundary}(--)?`)).filter((part) => !!part && /content-disposition/i.test(part))
  const parsedBody = {}
  // Parse each part into a form data object
  parts.map((part) => {
    const [headers, ...lines] = part.split('\r\n').filter((part) => !!part)
    const data = lines.join('\r\n').trim()

    // Extract the name and filename from the headers
    const name = /name="(.+?)"/.exec(headers)![1]
    const filename = /filename="(.+?)"/.exec(headers)
    if (filename) {
      const contentTypeMatch = /Content-Type: (.+)/i.exec(data)!
      const fileContent = data.slice(contentTypeMatch[0].length + 2)
      // This is a file field
      return Object.assign(parsedBody, {
        [name]: new File([fileContent], filename[1], { type: contentTypeMatch[1] })
      })
    }
    // This is a regular field
    return Object.assign(parsedBody, { [name]: data })
  })

  return parsedBody
}

const multipart = () => async (req: ReqWithBody, res: Response, next: NextFunction) => {
  if (hasBody(req.method!)) {
    req.body = await p((x) => {
      const boundary = getBoundary(req.headers['content-type']!)
      if (boundary) return parseMultipart(x, boundary)
    })(req, res, next)

    next()
  } else next()
}

export { custom, json, raw, text, urlencoded, multipart }
