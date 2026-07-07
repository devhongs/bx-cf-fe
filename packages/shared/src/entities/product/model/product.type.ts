import type { product as productApi } from '../../../shared/api';

type ProductSchema = productApi.components['schemas'];

export type ProductListItem = ProductSchema['ProductListResponse'];
export type ProductDetail = ProductSchema['ProductDetailResponse'];
export type Product = ProductListItem & Partial<Omit<ProductDetail, keyof ProductListItem>>;
export type ProductQueryParams = ProductSchema['ProductListRequest'] &
  ProductSchema['FilterReqDto'] &
  ProductSchema['PaginationReqDto'] &
  ProductSchema['SortReqDto'];
export type ProductListApiRequest = ProductSchema['ApiRequestProductReqDto'];
