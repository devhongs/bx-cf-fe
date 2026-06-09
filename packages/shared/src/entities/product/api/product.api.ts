import { httpService } from '../../../shared/ajax/http.service';
import { API_ENDPOINTS } from '../../../shared/constants';

import type { Product, ProductQueryParams } from '../model/product.type';

const EP = API_ENDPOINTS.PRODUCT;

export const fetchProductList = <T extends Product = Product>(
  params?: ProductQueryParams,
): Promise<Array<T>> =>
  httpService.get<Array<T>>(EP.LIST, params);

export const fetchProduct = <T extends Product = Product>(id: number): Promise<T> =>
  httpService.get<T>(EP.DETAIL(id));

export const createProduct = (payload: Product): Promise<Product> =>
  httpService.post<Product>(EP.LIST, payload);

export const deleteProduct = (id: number): Promise<void> =>
  httpService.delete<void>(EP.DETAIL(id));
