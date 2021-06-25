import ts from '@rollup/plugin-typescript'

const common = {
  output: [
    {
      dir: 'dist',
      format: 'esm',
    },
  ],
  plugins: [ts({ include: ['./src/**/*.ts'] })],
}

export default [
  {
    input: 'src/index.ts',
    ...common,
    external: ['querystring', 'http'],
  },
]
