import { httpService } from '../../../shared/ajax/http.service';

import type { Product, ProductQueryParams } from '../model/product.type';

export const fetchProductList = (params?: ProductQueryParams): Promise<Array<Product>> =>
  httpService.post<Array<Product>>('/product/list', params);

export const fetchProduct = (id: number): Promise<Product> =>
  httpService.post<Product>(`/product/detail/${id}`);

export const createProduct = (payload: Product): Promise<Product> =>
  httpService.post<Product>('/products', payload);

export const deleteProduct = (id: number): Promise<void> =>
  httpService.delete<void>(`/products/${id}`);
