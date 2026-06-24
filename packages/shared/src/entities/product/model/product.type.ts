import type { product as productApi } from '../../../shared/api';

type ProductSchema = productApi.components['schemas'];

export type Product = ProductSchema['ProductResponse'];
export type ProductQueryParams = Pick<ProductSchema['ProductDto'], 'productNm' | 'useYn'>;
