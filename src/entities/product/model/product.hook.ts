import type { UseMutationOptions, UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import { useMutation, useQuery } from '@tanstack/react-query';

import type { QueryHookOptions } from '@/shared/lib/utils';

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
export const useFetchProducts = <T extends Product = Product>(
  params?: ProductQueryParams,
  options?: QueryHookOptions<Array<T>>,
): UseQueryResult<Array<T>, Error> => {
  return useQuery({ ...options, ...fetchProductsQuery<T>(params) });
};

/**
 * 특정 상품 No의 상품 정보를 가져오는 쿼리 훅.
 * @param productId - 조회할 상품 ID.
 */
export const useFetchProduct = <T extends Product = Product>(
  productId: number,
  options?: QueryHookOptions<T>,
): UseQueryResult<T, Error> => {
  return useQuery({ ...options, ...fetchProductQuery<T>(productId) });
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
