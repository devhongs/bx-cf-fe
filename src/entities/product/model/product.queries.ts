import type { UseQueryOptions } from '@tanstack/react-query';

import type { ApiListResponse, ApiResponse } from '@/shared/api/types';

import { ProductService } from '../api/product.api';

import type { Product, ProductQueryParams } from './product.type';

export const queryKeys = {
  fetchList: (params?: ProductQueryParams) => ['products', params] as const,
  fetch: (id: number) => ['product', id] as const,
};

export const queryOptions = {
  // 상품 목록 조회
  fetchList: <T = Product>(
    params?: ProductQueryParams,
  ): UseQueryOptions<ApiListResponse<T>> => ({
    queryKey: queryKeys.fetchList(params),
    queryFn: async (): Promise<ApiListResponse<T>> =>
      ProductService.fetchAll(params),
  }),
  // 상품 상세 조회
  fetch: <T = Product>(productId: number): UseQueryOptions<ApiResponse<T>> => ({
    queryKey: queryKeys.fetch(productId),
    queryFn: () => ProductService.fetch(productId),
  }),
};

export const mutateOptions = {
  // 상품 생성
  create: () => ({
    mutationFn: (payload: Product) => ProductService.create(payload),
  }),
  // 상품 삭제
  delete: () => ({
    mutationFn: (id: number) => ProductService.delete(id),
  }),
};
