import { queryOptions } from '@tanstack/react-query';

import { createProduct, deleteProduct, fetchProduct, fetchProducts } from '../api/product.api';
import type { Product, ProductQueryParams } from './product.type';

export const queryKeys = {
  fetchList: (params?: ProductQueryParams) => ['products', params] as const,
  fetch: (id: number) => ['product', id] as const,
};

// 개별 Named Export와 v5 queryOptions 헬퍼 적용
export const fetchProductsQuery = <T = Product>(params?: ProductQueryParams) =>
  queryOptions({
    queryKey: queryKeys.fetchList(params),
    queryFn: () => fetchProducts<T>(params),
  });

export const fetchProductQuery = <T = Product>(productId: number) =>
  queryOptions({
    queryKey: queryKeys.fetch(productId),
    queryFn: () => fetchProduct<T>(productId),
  });

// 상품 생성 뮤테이션 옵션
export const createProductMutation = () => ({
  mutationFn: (payload: Product) => createProduct(payload),
});

// 상품 삭제 뮤테이션 옵션
export const deleteProductMutation = () => ({
  mutationFn: (id: number) => deleteProduct(id),
});
