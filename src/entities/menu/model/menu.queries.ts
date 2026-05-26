import { queryOptions } from '@tanstack/react-query';

import {
  createMenu,
  deleteMenu,
  fetchMenu,
  fetchMenus,
} from '../api/menu.api';
import type { Menu, MenuQueryParams } from './menu.type';

export const queryKeys = {
  fetchList: (params?: MenuQueryParams) => ['menus', params] as const,
  fetch: (id: number) => ['menu', id] as const,
};

// 개별 Named Export와 v5 queryOptions 헬퍼 적용
export const fetchMenusQuery = <T = Menu>(params?: MenuQueryParams) =>
  queryOptions({
    queryKey: queryKeys.fetchList(params),
    queryFn: () => fetchMenus<T>(params),
  });

export const fetchMenuQuery = <T = Menu>(menuId: number) =>
  queryOptions({
    queryKey: queryKeys.fetch(menuId),
    queryFn: () => fetchMenu<T>(menuId),
  });

// 개별 Named Export 뮤테이션 옵션
export const createMenuMutation = () => ({
  mutationFn: (payload: Menu) => createMenu(payload),
});

export const deleteMenuMutation = () => ({
  mutationFn: (id: number) => deleteMenu(id),
});
