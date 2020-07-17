import ts from 'rollup-plugin-typescript2'

const shared = {
  plugins: [ts()],
  external: ['querystring', 'events'],
}

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.js',
        format: 'esm',
      },
      {
        file: 'dist/index.cjs',
        format: 'cjs',
      },
    ],
    ...shared,
  },
  {
    input: 'src/koa.ts',
    output: [
      {
        file: 'dist/koa.js',
        format: 'esm',
      },
      {
        file: 'dist/koa.cjs',
        format: 'cjs',
      },
    ],
    ...shared,
  },
]
