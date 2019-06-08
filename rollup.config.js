// import run from 'rollup-plugin-run'
import ts from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'

const dev = process.env.ROLLUP_WATCH === 'true'

export default {
  input: 'parsec.ts',
  output: {
    file: 'dist/parsec.js',
    format: 'cjs'
  },
  plugins: [, /* dev && run() */ ts(), !dev && terser()]
}
