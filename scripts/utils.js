import { getPluginNames } from '@kasko/fe-webapp-utils-lib/dev';
import { transform } from 'esbuild';
import { load as loadYaml } from 'js-yaml';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';

/**
 * @param {string=} file
 */
export async function readCssFile(file) {
  if (!file) {
    return;
  }

  return transform(readFileSync(file, 'utf-8'), {
    loader: 'css',
    charset: 'utf8',
    format: 'esm',
    target: 'chrome60',
    minify: false,
    sourcemap: false,
  }).then((res) => res.code);
}

/**
 * @param {Record<string, any>} data
 */
export function jsonFile(data) {
  return JSON.stringify(data, (key, value) => {
    // Remove `$schema` property from every json
    if (key === '$schema') {
      return undefined;
    }

    return value;
  }, 2);
}

/**
 * @param {string} filename
 * @param {Parameters<typeof writeFileSync>[1]} content
 * @param {Parameters<typeof writeFileSync>[2]} charset
 */
export function writeFileSyncRecursive(filename, content, charset) {
  // -- normalize path separator to '/' instead of path.sep,
  // -- as / works in node for Windows as well, and mixed \\ and / can appear in the path
  let filepath = filename.replace(/\\/g, '/');

  // -- preparation to allow absolute paths as well
  let root = '';
  if (filepath[0] === '/') {
    root = '/';
    filepath = filepath.slice(1);
  } else if (filepath[1] === ':') {
    root = filepath.slice(0, 3); // c:\
    filepath = filepath.slice(3);
  }

  // -- create folders all the way down
  const folders = filepath.split('/').slice(0, -1); // remove last item, file
  folders.reduce(
    (acc, folder) => {
      const folderPath = `${acc}${folder}/`;
      if (!existsSync(folderPath)) {
        mkdirSync(folderPath);
      }
      return folderPath;
    },
    root, // first 'acc', important
  );

  // -- write file
  writeFileSync(root + filepath, content, charset);
}

/**
 * @param {string} path
 */
export async function getPlugins(path) {
  /** @type {Record<string, string>} */
  // @ts-ignore
  const pluginVersions = loadYaml(readFileSync(path, 'utf8'));

  for (const [key, version] of Object.entries(pluginVersions)) {
    if (!/^\d/.test(version)) {
      throw new Error(
        `Please specify locked version for plugin "${key}" in ./src/plugin-versions.yaml`,
      );
    }
  }

  return getPluginNames(pluginVersions);
}
