import { queryOptions } from '@tanstack/react-query';

import { createProduct, deleteProduct, fetchProduct, fetchProductList } from '../api/product.api';
import type { Product, ProductQueryParams } from './product.type';

export const productQueryKeys = {
  all: ['product'] as const,
  list: (params?: ProductQueryParams) => ['product', 'list', params] as const,
  detail: (id: number) => ['product', 'detail', id] as const,
};

// 개별 Named Export와 v5 queryOptions 헬퍼 적용
export const fetchProductListQuery = (params?: ProductQueryParams) =>
  queryOptions({
    queryKey: productQueryKeys.list(params),
    queryFn: () => fetchProductList(params),
  });

export const fetchProductQuery = (productId: number) =>
  queryOptions({
    queryKey: productQueryKeys.detail(productId),
    queryFn: () => fetchProduct(productId),
  });

// 상품 생성 뮤테이션 옵션
export const createProductMutation = () => ({
  mutationFn: (payload: Product) => createProduct(payload),
});

// 상품 삭제 뮤테이션 옵션
export const deleteProductMutation = () => ({
  mutationFn: (id: number) => deleteProduct(id),
});
