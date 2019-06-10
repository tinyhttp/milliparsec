import { createServer } from 'http'
import { custom } from '../lib/body-parsec'

createServer(async (req, res) => {
  const data = await custom(req, data => data.toUpperCase())
  res.end(req.body)
  console.log(data) // ANY DATA BECOMES UPPERCASE
}).listen(80)
