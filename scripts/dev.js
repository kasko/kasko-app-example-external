import 'dotenv/config';
import { webappSetup } from '@kasko/fe-webapp-utils-lib/server';
import * as esbuild from 'esbuild';
import { load as loadYaml } from 'js-yaml';
import { readFileSync } from 'node:fs';
import process from 'node:process';

import mockApi from '../mock-api/api.js';

import { commonEsbuildConfig, entries } from './common.js';

if (!process.env.WEBAPP_LANGUAGE) {
  throw new Error('WEBAPP_LANGUAGE is not set in .env');
}

if (!process.env.WEBAPP_PUBLIC_KEY) {
  throw new Error('WEBAPP_PUBLIC_KEY is not set in .env');
}

/** @type {Record<string, string>} */
// @ts-ignore
const plugins = loadYaml(readFileSync('./src/plugin-versions.yaml', 'utf8'));

const { serverMiddleware, entryPointsExtra } = await webappSetup({
  outbase: 'src',
  host: process.env.APP_HOST || 'eu1.kaskocloud.com',
  kaskoJsUrl: 'https://eu1.kaskojs.com/v2',
  dataSvcUrl: 'https://api.eu1.kaskocloud.com/',
  language: process.env.WEBAPP_LANGUAGE,
  publicKey: process.env.WEBAPP_PUBLIC_KEY,
  port: 3000,
  plugins,
  entries,
});

const ctx = await esbuild.context({
  ...commonEsbuildConfig,
  outbase: 'src',
  entryPoints: ['./src/app.js', './src/dashboard.css', ...entryPointsExtra],
  outdir: 'www',
  write: false,
  assetNames: '[name]',
  define: {
    'process.env.NODE_ENV': '"development"',
  },
  sourcemap: 'linked',
  metafile: false,
  minify: true,
  logLevel: 'warning',
});

await ctx.watch();
const serveContext = await ctx.serve({ servedir: 'www' });
await serverMiddleware(serveContext, mockApi);

process.on('SIGTERM', async () => {
  await ctx.dispose();
  process.exit(0);
});
