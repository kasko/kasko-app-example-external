import { default as productConfig } from '../product.json' with { type: "json" };

export const entries = Object.entries(productConfig.integrations)
  .reduce((acc, [id, integration]) => {
    acc[id] = {
      index: integration.index,
      extra: [integration.css],
    };
    return acc;
  }, {});

/** @type {import("esbuild").BuildOptions} */
export const commonEsbuildConfig = {
  charset: 'utf8',
  format: 'cjs',
  target: ['chrome60', 'es2015'],
  platform: 'browser',
  bundle: true,
  minify: false,
  define: {
    'process.env.NODE_ENV': '"development"',
  },
  legalComments: 'none',
  sourcemap: 'linked',
  write: false,
  tsconfig: './jsconfig.json',
  logLevel: 'info',
  loader: {
    '.woff': 'file',
    '.woff2': 'file',
    '.otf': 'file',
    '.ttf': 'file',
    '.png': 'file',
  },
};
