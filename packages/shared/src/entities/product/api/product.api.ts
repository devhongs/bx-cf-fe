import { httpService } from '../../../shared/ajax/http.service';

import type { Product, ProductListApiRequest, ProductQueryParams } from '../model/product.type';

const compact = <T extends Record<string, unknown>>(value: T): Partial<T> | undefined => {
  const entries = Object.entries(value).filter(([, item]) => item !== undefined);
  if (entries.length === 0) return undefined;
  return Object.fromEntries(entries) as Partial<T>;
};

const toProductListApiRequest = (params?: ProductQueryParams): ProductListApiRequest | undefined => {
  if (!params) return undefined;

  const { page, size, offset, keyword, searchType, useYn, sort, productNm } = params;
  const request = compact({
    pagination: compact({ page, size, offset }),
    filter: compact({ keyword, searchType, useYn }),
    sort: compact({ sort }),
    data: compact({ productNm }),
  });

  return request as ProductListApiRequest | undefined;
};

export const fetchProductList = (params?: ProductQueryParams): Promise<Array<Product>> =>
  httpService.post<Array<Product>>('/product/list', toProductListApiRequest(params));

export const fetchProduct = (id: number): Promise<Product> =>
  httpService.post<Product>(`/product/detail/${id}`);

export const createProduct = (payload: Product): Promise<Product> =>
  httpService.post<Product>('/products', payload);

export const deleteProduct = (id: number): Promise<void> =>
  httpService.delete<void>(`/products/${id}`);
