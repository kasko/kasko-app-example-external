import * as index from './index.js';
import * as packageJson from '../../../package.json';

/**
 * @typedef {Object} ResponseProps
 * @property {Omit<typeof index, 'response'>} index
 * @property {Record<string, string>} queryString
 */

/**
 * @param {ResponseProps} options
 */
export async function response({ index, queryString }) {
  return {
    object: 'touchpoint',
    title: packageJson.name,
    analytics_key: 'demo',
    language: queryString.language,
    save_for_later: 'enabled',
    currency: 'eur',
    content: index.product.contents[queryString.language],
    manifest: index.product.manifest,
    items: Object.keys(index.subProducts).map((id) => ({ id })),
  };
}
