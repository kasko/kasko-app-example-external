import 'dotenv/config';
import { requireTypescript } from '@kasko/fe-webapp-utils-lib/dev';
import * as esbuild from 'esbuild';
import { writeFileSync, cpSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { commonEsbuildConfig, entries } from './common.js';
import { getPlugins, jsonFile, readCssFile, writeFileSyncRecursive } from './utils.js';

/**
 * Building instructions.
 *
 * # This is handled by webpack itself:
 * - build /src/app.ts
 *   └> /dist/general/*
 *
 * - copy files of /dist/general/* to every /dist/products/.../webapp/* folder as each
 * product folder will be a separate build to be uploaded to KASKO platform.
 *
 * - build /src/products/[productId]/index.ts
 *   └> /dist/products/[productId]/manifests/manifest.json
 *
 * - build /src/sub_products/[subProductId]/index.ts
 *   └> /dist/products/[productId]/manifests/sub_products/[subProductId]/manifest.json
 *   └> /dist/products/[productId]/manifests/sub_products/[subProductId]/field_definition.json
 *   └> /dist/products/[productId]/manifests/sub_products/[subProductId]/pricing_field_definition.json
 *
 * - update /dist/products/[productId]/.kasko/config.json
 *   - add "require" property based on /src/plugin-versions.yaml
 *   - add "manifest" property
 *   - optionally add "extra_manifests" property
 */

const outdirGeneral = './dist/general';
const dotKaskoConfig = JSON.parse(readFileSync('.kasko/config.json', 'utf-8'));

const plugins = await getPlugins('./src/plugin-versions.yaml');

const result = await esbuild.build({
  ...commonEsbuildConfig,
  outbase: 'src',
  entryPoints: ['./src/app.js', './src/dashboard.css'],
  sourcemap: false,
  outdir: outdirGeneral,
  write: true,
  define: {
    'process.env.NODE_ENV': '"production"',
  },
  metafile: true,
  minify: false,
});

// For bundle analysis
writeFileSync('meta.json', JSON.stringify(result.metafile));

// Copy .kasko/* → dist/general/.kasko/*
cpSync('./.kasko', join(outdirGeneral, '.kasko'), { recursive: true });

const integrations = await Promise.all(
  Object.entries(entries).map(async ([id, { index, extra }]) => {
    const css = extra?.find((file) => file.endsWith('.css'));

    return {
      id,
      extra,
      css: await readCssFile(css),
      data: await requireTypescript(index, id),
    };
  }),
);

/** @type {Record<string, Record<string, string>>} */
const products = {};

// Prepare files to write
for (const integration of integrations) {
  const productId = integration.data.product.id;
  const product = (products[productId] ??= {});
  const productDotKaskoConfig = {
    ...dotKaskoConfig,
    require: plugins,
    manifest: 'manifests/manifest.json',
  };

  // dist/products/../contents.json
  // product['contents.json'] = jsonFile(integration.data.product.contents);

  // dist/products/../webapp/manifests/manifest.json
  product['webapp/manifests/manifest.json'] = jsonFile(await integration.data.product.manifest);

  if (integration.data.product?.fieldDefinition) {
    // dist/products/../field_definition.json
    product["field_definition.json"] = jsonFile(integration.data.product.fieldDefinition);
  }

  if (integration.data.product?.pricingFieldDefinition) {
    // dist/products/../pricing_field_definition.json
    product["pricing_field_definition.json"] = jsonFile(integration.data.product.pricingFieldDefinition);
  }

  for (const subProductInt in integration.data.subProducts) {
    const subProduct = integration.data.subProducts[subProductInt];
    const subProductId = subProduct.id;
    const subProductPath = `webapp/manifests/sub_products/${subProductId}`;

    // dist/products/../webapp/manifests/sub_products/../contents.json
    // product[`${subProductPath}/contents.json`] = jsonFile(subProduct.contents);

    // dist/products/../webapp/manifests/sub_products/../field_definition.json
    // product[`${subProductPath}/field_definition.json`] = jsonFile(subProduct.fieldDefinition);

    // dist/products/../webapp/manifests/sub_products/../pricing_field_definition.json
    // product[`${subProductPath}/pricing_field_definition.json`] = jsonFile(
    //   subProduct.pricingFieldDefinition,
    // );

    // dist/products/../webapp/manifests/sub_products/../manifest.json
    product[`${subProductPath}/manifest.json`] = jsonFile(await subProduct.manifest);

    // Add sub product manifest path to product dot kasko config file,
    // path should be relative to dist/products/../webapp/
    productDotKaskoConfig.extra_manifests ??= {};
    productDotKaskoConfig.extra_manifests[subProductId] = `${subProductPath}/manifest.json`.replace(
      /^webapp\//,
      '',
    );
  }

  // dist/products/../webapp/.kasko/config.json
  product['webapp/.kasko/config.json'] = jsonFile(productDotKaskoConfig);

  // dist/products/../integrations/[..].json
  // product[`integrations/${integration.id}.json`] = jsonFile({
  //   id: integration.id,
  //   css: integration.css,
  // });
}

// Write files to file system
for (const id in products) {
  const files = products[id];
  const outdirProduct = join(outdirGeneral, '..', 'products', id);

  // Copy dist/general/* → dist/products/../webapp/*
  cpSync(outdirGeneral, join(outdirProduct, 'webapp'), { recursive: true });

  // Write all product files → dist/products/../*
  for (const path in files) {
    writeFileSyncRecursive(join(outdirProduct, path), files[path], 'utf-8');
  }
}
