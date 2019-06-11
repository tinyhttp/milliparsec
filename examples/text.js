import { createServer } from 'http'
import { text } from '../lib/body-parsec'

createServer(async (req, res) => {
  if (req.method === 'GET') {
    res.end('Try POST')
  } else {
    await text(req)
    res.end(`You sent: ${req.body}`)
  }
}).listen(80, () => console.log('Listening on http://localhost'))
