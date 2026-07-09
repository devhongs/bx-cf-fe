import { httpService } from '../../../shared/ajax/http.service';

import type { Menu, MenuPayload, MenuQueryParams } from '../model/menu.type';

export const fetchMenuList = <T extends Menu = Menu>(
  _params?: MenuQueryParams,
): Promise<Array<T>> => httpService.post<Array<T>>('/system/menus/list');

export const fetchMenu = async <T extends Menu = Menu>(menuId: number): Promise<T> => {
  const menus = await fetchMenuList<T>();
  const menu = menus.find((item) => item.menuId === menuId);
  if (!menu) {
    throw new Error(`Menu not found: ${menuId}`);
  }
  return menu;
};

export const createMenu = (payload: MenuPayload): Promise<void> =>
  httpService.post<void>('/system/menus/create', { data: payload });

export const updateMenu = (menuId: number, payload: MenuPayload): Promise<void> =>
  httpService.post<void>(`/system/menus/${encodeURIComponent(menuId)}/update`, {
    data: payload,
  });

export const deleteMenu = (menuId: number): Promise<void> =>
  httpService.delete<void>(`/system/menus/${encodeURIComponent(menuId)}`);
