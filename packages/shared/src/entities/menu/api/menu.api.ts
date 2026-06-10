import { httpService } from '../../../shared/ajax/http.service';

import type { Menu, MenuQueryParams } from '../model/menu.type';

export const fetchMenuList = <T extends Menu = Menu>(
  params?: MenuQueryParams,
): Promise<Array<T>> =>
  httpService.get<Array<T>>('/menus', params);

export const fetchMenu = <T extends Menu = Menu>(id: number): Promise<T> =>
  httpService.get<T>(`/menus/${id}`);

export const createMenu = (payload: Menu): Promise<Menu> =>
  httpService.post<Menu>('/menus', payload);

export const deleteMenu = (id: number): Promise<void> =>
  httpService.delete<void>(`/menus/${id}`);
