import type { UseMutationOptions, UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { QueryHookOptions } from '../../../shared/types';

import {
  createProductMutation,
  deleteProductMutation,
  fetchProductQuery,
  fetchProductListQuery,
  productQueryKeys,
} from './product.queries';
import type { Product, ProductQueryParams } from './product.type';

/**
 * 모든 상품 목록을 가져오는 쿼리 훅.
 * @param params - 상품 목록 조회 쿼리 파라미터.
 * @param options - 추가 쿼리 옵션.
 */
export const useFetchProductList = <T extends Product = Product>(
  params?: ProductQueryParams,
  options?: QueryHookOptions<Array<T>>,
): UseQueryResult<Array<T>, Error> => {
  return useQuery({ ...options, ...fetchProductListQuery<T>(params) });
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
  const queryClient = useQueryClient();
  return useMutation({
    ...createProductMutation(),
    ...options,
    onSuccess: async (data, variables, onMutateResult, context) => {
      await queryClient.invalidateQueries({ queryKey: productQueryKeys.all });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};

/**
 * 기존 상품을 삭제하는 뮤테이션 훅.
 * @param [options] - 추가 뮤테이션 설정 옵션.
 */
export const useDeleteProduct = (
  options?: UseMutationOptions<void, Error, number, unknown>,
): UseMutationResult<void, Error, number, unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    ...deleteProductMutation(),
    ...options,
    onSuccess: async (data, variables, onMutateResult, context) => {
      await queryClient.invalidateQueries({ queryKey: productQueryKeys.all });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
