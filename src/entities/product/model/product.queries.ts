import type { UseQueryOptions } from '@tanstack/react-query'

import type { ApiListResponse, ApiResponse } from '@/shared/api/types'

import ProductService from '../api/product.api'

import type { Product, ProductQueryParams } from './product.type'

export const queryKeys = {
  fetchList: ['products'] as const,
  fetch: (id: number) => ['product', id] as const,
}

export const queryOptions = {
  // 알람 목록 조회
  fetchList: <T = Product>(
    params?: ProductQueryParams,
  ): UseQueryOptions<ApiListResponse<T>> => ({
    queryKey: queryKeys.fetchList,
    queryFn: async (): Promise<ApiListResponse<T>> =>
      ProductService.fetchAll(params),
  }),
  // 알람 상세 조회
  fetch: <T = Product>(menuId: number): UseQueryOptions<ApiResponse<T>> => ({
    queryKey: queryKeys.fetch(menuId),
    queryFn: () => ProductService.fetch(menuId),
  }),
}

export const mutateOptions = {
  // 알람 생성
  create: () => ({
    mutationFn: (payload: Product) => ProductService.create(payload),
  }),
  // 알람 삭제
  delete: () => ({
    mutationFn: (id: number) => ProductService.delete(id),
  }),
}
