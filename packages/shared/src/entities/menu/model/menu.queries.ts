import { queryOptions } from '@tanstack/react-query';

import { createMenu, deleteMenu, fetchMenu, fetchMenuList, updateMenu } from '../api/menu.api';
import type { Menu, MenuPayload, MenuQueryParams } from './menu.type';

export const menuQueryKeys = {
  all: ['menu'] as const,
  lists: () => ['menu', 'list'] as const,
  list: (params?: MenuQueryParams) => ['menu', 'list', params] as const,
  detail: (id: number) => ['menu', 'detail', id] as const,
};

export const menuListQuery = <T extends Menu = Menu>(params?: MenuQueryParams) =>
  queryOptions({
    queryKey: menuQueryKeys.list(params),
    queryFn: () => fetchMenuList<T>(params),
  });

export const menuDetailQuery = <T extends Menu = Menu>(menuId: number) =>
  queryOptions({
    queryKey: menuQueryKeys.detail(menuId),
    queryFn: () => fetchMenu<T>(menuId),
  });

export const createMenuMutation = () => ({
  mutationFn: (payload: MenuPayload) => createMenu(payload),
});

export const updateMenuMutation = () => ({
  mutationFn: ({ menuId, payload }: { menuId: number; payload: MenuPayload }) =>
    updateMenu(menuId, payload),
});

export const deleteMenuMutation = () => ({
  mutationFn: (menuId: number) => deleteMenu(menuId),
});

export const fetchMenuListQuery = menuListQuery;
export const fetchMenuQuery = menuDetailQuery;
