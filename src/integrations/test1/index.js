import * as productJSON from '../../../product.json';
import * as product from '../../product/index.js';

export { response } from './response.js';
export { product };

export const subProducts = {
  [productJSON.integrations.in_222.version_id]: product,
};
