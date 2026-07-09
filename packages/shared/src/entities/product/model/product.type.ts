import type { product as productApi } from '../../../shared/api';

type ProductSchema = productApi.components['schemas'];
type ProductListRequest = ProductSchema['ProductListRequest'];

export type ProductListItem = ProductSchema['ProductListResponse'];
export type ProductDetail = ProductSchema['ProductDetailResponse'];
export type Product = ProductListItem & Partial<Omit<ProductDetail, keyof ProductListItem>>;
export type ProductQueryParams = NonNullable<ProductListRequest['data']> &
  NonNullable<ProductListRequest['filter']> &
  NonNullable<ProductListRequest['pagination']> &
  NonNullable<ProductListRequest['sort']>;
export type ProductListApiRequest = ProductListRequest;
