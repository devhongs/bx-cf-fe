import { httpService } from '../../../shared/ajax/http.service';

import type { Product, ProductQueryParams } from '../model/product.type';

export const fetchProductList = <T extends Product = Product>(
  params?: ProductQueryParams,
): Promise<Array<T>> =>
  httpService.get<Array<T>>('/products', params);

export const fetchProduct = <T extends Product = Product>(id: number): Promise<T> =>
  httpService.get<T>(`/products/${id}`);

export const createProduct = (payload: Product): Promise<Product> =>
  httpService.post<Product>('/products', payload);

export const deleteProduct = (id: number): Promise<void> =>
  httpService.delete<void>(`/products/${id}`);
