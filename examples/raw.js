import { createServer } from 'http'
import { raw } from '../lib/body-parsec'

createServer(async (req, res) => {
  await raw(req)
  res.end(`You sent: ${req.body}`)
}).listen(80, () => console.log('Listening on http://localhost'))
