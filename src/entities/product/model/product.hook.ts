import type {
  UseMutationOptions,
  UseMutationResult,
  UseQueryResult,
} from '@tanstack/react-query';
import { useMutation, useQuery } from '@tanstack/react-query';

import type { ApiListResponse, ApiResponse } from '@/shared/api/types';

import {
  createProductMutation,
  deleteProductMutation,
  fetchProductQuery,
  fetchProductsQuery,
} from './product.queries';
import type { Product, ProductQueryParams } from './product.type';

/**
 * 모든 상품 목록을 가져오는 쿼리 훅.
 * @param params - 상품 목록 조회 쿼리 파라미터.
 * @param options - 추가 쿼리 옵션.
 */
export const useFetchProducts = <T = Product>(
  params?: ProductQueryParams,
  options?: any,
): UseQueryResult<ApiListResponse<T>, Error> => {
  return useQuery<ApiListResponse<T>, Error>({ ...fetchProductsQuery<T>(params), ...options });
};

/**
 * 특정 상품 No의 상품 정보를 가져오는 쿼리 훅.
 * @param productId - 조회할 상품 ID.
 */
export const useFetchProduct = <T = Product>(
  productId: number,
  options?: any,
): UseQueryResult<ApiResponse<T>, Error> => {
  return useQuery<ApiResponse<T>, Error>({ ...fetchProductQuery<T>(productId), ...options });
};

/**
 * 새로운 상품을 생성하는 뮤테이션 훅.
 * @param [options] - 추가 뮤테이션 설정 옵션.
 */
export const useCreateProduct = (
  options?: UseMutationOptions<Product, Error, Product, unknown>,
): UseMutationResult<Product, Error, Product, unknown> => {
  return useMutation({
    ...createProductMutation(),
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      // await showSaveComplete()
      // 추가적인 성공 처리 로직이 있다면 실행
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context, mutation);
      }
    },
  });
};

/**
 * 기존 상품을 삭제하는 뮤테이션 훅.
 * @param [options] - 추가 뮤테이션 설정 옵션.
 */
export const useDeleteProduct = (
  options?: UseMutationOptions<any, Error, number, unknown>,
): UseMutationResult<any, Error, number, unknown> => {
  // 반환 타입 any는 실제 API 응답 타입으로 명시 권장
  return useMutation({
    ...deleteProductMutation(),
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      // await showDeleteComplete()
      // 추가적인 성공 처리 로직이 있다면 실행
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context, mutation);
      }
    },
  });
};
