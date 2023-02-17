import { ServerResponse as Response, IncomingMessage, STATUS_CODES } from 'http'
import { EventEmitter } from 'events'

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

// JSON, raw, FormData

const custom =
  <T = any>(fn: (body: any) => any) =>
  async (req: ReqWithBody, _res: Response, next: NextFunction) => {
    req.body = await p<T>(fn)(req, undefined, next)
    next()
  }

const json = () => async (req: ReqWithBody, res: Response, next: NextFunction) => {
  if (hasBody(req.method)) {
    req.body = await p((x) => JSON.parse(x.toString()))(req, res, next)
    next()
  } else next()
}

const raw = () => async (req: ReqWithBody, _res: Response, next: NextFunction) => {
  if (hasBody(req.method)) {
    req.body = await p((x) => x)(req, _res, next)
    next()
  }
  else next()
}

const text = () => async (req: ReqWithBody, _res: Response, next: NextFunction) => {
  if (hasBody(req.method)) {
    req.body = await p((x) => x.toString())(req, _res, next)
    next()
  }
  else next()
}

const urlencoded = () => async (req: ReqWithBody, res: Response, next: NextFunction) => {
  if (hasBody(req.method)) {
    req.body = await p((x) => {
      const urlSearchParam = new URLSearchParams(x.toString())
      return Object.fromEntries(urlSearchParam.entries())
    })(req, res, next)
    next()
  } else next()
}

const multipart = () => async (req: ReqWithBody, res: Response, next: NextFunction) => {
  if (hasBody(req.method)) {
    req.body = await p((x) => {
      const boundary = getBoundary(req.headers['content-type'])
      if (boundary) {
        // This is a multipart request
        const parts = parseMultipart(x, boundary)

        return parts
      }
    })(req, res, next)

    next()
  } else next()
};

const getBoundary = (contentType: string) => {
  // Extract the boundary from the Content-Type header
  const match = /boundary=(.+);?/.exec(contentType)
  return match ? `--${match[1]}` : null
}

const parseMultipart = (body: string, boundary: string) => {
  // Split the body into an array of parts
  const parts = body.split(new RegExp(`${boundary}(--)?`)).filter(part => !!part && (/content-disposition/i.test(part)))
  let parsedBody = {}
  // Parse each part into a form data object
  parts.map(part => {
    const [headers, ...lines] = part.split('\r\n').filter(part => !!part)
    const data = lines.join('\r\n').trim()

    // Extract the name and filename from the headers
    const name = /name="(.+?)"/.exec(headers)[1]
    const filename = /filename="(.+?)"/.exec(headers)
    if (filename) {
      // This is a file field
      return Object.assign(parsedBody, {
        [name]: {
          filename: filename[1],
          value: data,
        }
      })
    } else {
      // This is a regular field
      return Object.assign(parsedBody, { [name]: data })
    }
  })

  return parsedBody
}
export { custom, json, raw, text, urlencoded, multipart }
