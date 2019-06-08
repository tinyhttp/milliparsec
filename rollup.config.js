// import run from 'rollup-plugin-run'
import ts from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'

const dev = process.env.ROLLUP_WATCH === 'true'

export default {
  input: 'body-parsec.ts',
  output: {
    file: 'lib/body-parsec.js',
    format: 'cjs'
  },
  plugins: [ts(), !dev && terser()],
  external: ['querystring', 'fs']
}
