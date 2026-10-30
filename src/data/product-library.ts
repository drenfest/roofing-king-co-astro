import gaf from './product-catalog.json';
import manufacturers from './manufacturer-products.json';
import accessories from './product-accessories.json';
import plyGem from './ply-gem-products.json';
import type {ProductPresentation} from './product-types';
// Existing GAF source data stays independent of the additional manufacturer catalogs.
export const productLibrary={...gaf,...manufacturers,...accessories,...plyGem} as Record<string,ProductPresentation>;
