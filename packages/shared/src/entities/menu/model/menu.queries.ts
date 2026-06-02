import { queryOptions } from '@tanstack/react-query';

import { createMenu, deleteMenu, fetchMenu, fetchMenuList } from '../api/menu.api';
import type { Menu, MenuQueryParams } from './menu.type';

export const queryKeys = {
  all: ['menu'] as const,
  list: (params?: MenuQueryParams) => ['menu', 'list', params] as const,
  detail: (id: number) => ['menu', 'detail', id] as const,
};

// 개별 Named Export와 v5 queryOptions 헬퍼 적용
export const fetchMenuListQuery = <T extends Menu = Menu>(params?: MenuQueryParams) =>
  queryOptions({
    queryKey: queryKeys.list(params),
    queryFn: () => fetchMenuList<T>(params),
  });

export const fetchMenuQuery = <T extends Menu = Menu>(menuId: number) =>
  queryOptions({
    queryKey: queryKeys.detail(menuId),
    queryFn: () => fetchMenu<T>(menuId),
  });

// 개별 Named Export 뮤테이션 옵션
export const createMenuMutation = () => ({
  mutationFn: (payload: Menu) => createMenu(payload),
});

export const deleteMenuMutation = () => ({
  mutationFn: (id: number) => deleteMenu(id),
});
