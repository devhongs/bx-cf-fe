import type { ApiListResponse, ApiResponse } from '@/shared/api/types';
import { API_URL } from '@/shared/constants';
import { HttpJsonService } from '@/shared/lib/ajax/http.json.service';

import type { Product, ProductQueryParams } from '../model/product.type';

/**
 * 상품 목록을 조회합니다.
 * @param [params] - 조회 파라미터 (선택 사항).
 * @returns 상품 목록 페이지네이션 응답 Promise.
 */
export const fetchProducts = async <T = Product>(
  params?: ProductQueryParams,
): Promise<ApiListResponse<T>> => {
  return HttpJsonService.fetchAll<T>(`${API_URL}/products`, params);
};

/**
 * 특정 ID의 상품을 조회합니다.
 * @param id - 조회할 상품 ID.
 * @returns 상품 상세 정보 Promise.
 */
export const fetchProduct = async <T = Product>(id: number): Promise<ApiResponse<T>> => {
  return HttpJsonService.fetch<T>(`${API_URL}/products/${id}`);
};

/**
 * 새로운 상품을 생성합니다.
 * @param payload - 생성할 상품 정보.
 * @returns 생성된 상품 정보 Promise.
 */
export const createProduct = async (payload: Product): Promise<Product> => {
  return HttpJsonService.post<any>(`${API_URL}/products`, payload);
};

/**
 * 상품을 삭제합니다.
 * @param id - 삭제할 상품 ID.
 * @returns 삭제 완료 Promise.
 */
export const deleteProduct = async (id: number): Promise<any> => {
  return HttpJsonService.delete<any>(`${API_URL}/products/${id}`);
};

