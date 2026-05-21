import type { UseQueryOptions } from '@tanstack/react-query';

import type { ApiListResponse, ApiResponse } from '@/shared/api/types';

import MenuService from '../api/menu.api';

import type { Menu, MenuQueryParams } from './menu.type';

export const queryKeys = {
  fetchList: ['menus'] as const,
  fetch: (id: number) => ['menu', id] as const,
};

export const queryOptions = {
  // 알람 목록 조회
  fetchList: <T = Menu>(
    params?: MenuQueryParams,
  ): UseQueryOptions<ApiListResponse<T>> => ({
    queryKey: queryKeys.fetchList,
    queryFn: async (): Promise<ApiListResponse<T>> =>
      MenuService.fetchAll(params),
  }),
  // 알람 상세 조회
  fetch: <T = Menu>(menuId: number): UseQueryOptions<ApiResponse<T>> => ({
    queryKey: queryKeys.fetch(menuId),
    queryFn: () => MenuService.fetch(menuId),
  }),
};

export const mutateOptions = {
  // 알람 생성
  create: () => ({
    mutationFn: (payload: Menu) => MenuService.create(payload),
  }),
  // 알람 삭제
  delete: () => ({
    mutationFn: (id: number) => MenuService.delete(id),
  }),
};
