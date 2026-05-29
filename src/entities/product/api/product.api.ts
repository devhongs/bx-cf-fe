import { API_URL } from '@/shared/constants';
import { httpService } from '@/shared/lib/ajax/http.service';

import type { Product, ProductQueryParams } from '../model/product.type';

/**
 * 상품 목록을 조회합니다.
 * @param [params] - 조회 파라미터 (선택 사항).
 * @returns 상품 목록 응답 Promise.
 */
export const fetchProducts = <T extends Product = Product>(
  params?: ProductQueryParams,
): Promise<Array<T>> =>
  httpService.get<Array<T>>(`${API_URL}/products`, params);

/**
 * 특정 ID의 상품을 조회합니다.
 * @param id - 조회할 상품 ID.
 * @returns 상품 상세 정보 Promise.
 */
export const fetchProduct = <T extends Product = Product>(id: number): Promise<T> =>
  httpService.get<T>(`${API_URL}/products/${id}`);

/**
 * 새로운 상품을 생성합니다.
 * @param payload - 생성할 상품 정보.
 * @returns 생성된 상품 정보 Promise.
 */
export const createProduct = (payload: Product): Promise<Product> =>
  httpService.post<Product>(`${API_URL}/products`, payload);

/**
 * 상품을 삭제합니다.
 * @param id - 삭제할 상품 ID.
 * @returns 삭제 완료 Promise.
 */
export const deleteProduct = (id: number): Promise<void> =>
  httpService.delete<void>(`${API_URL}/products/${id}`);
