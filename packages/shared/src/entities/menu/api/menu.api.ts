import { httpService } from '../../../shared/ajax/http.service';
import { API_ENDPOINTS } from '../../../shared/constants';

import type { Menu, MenuQueryParams } from '../model/menu.type';

const EP = API_ENDPOINTS.MENU;

export const fetchMenuList = <T extends Menu = Menu>(
  params?: MenuQueryParams,
): Promise<Array<T>> =>
  httpService.get<Array<T>>(EP.LIST, params);

export const fetchMenu = <T extends Menu = Menu>(id: number): Promise<T> =>
  httpService.get<T>(EP.DETAIL(id));

export const createMenu = (payload: Menu): Promise<Menu> =>
  httpService.post<Menu>(EP.LIST, payload);

export const deleteMenu = (id: number): Promise<void> =>
  httpService.delete<void>(EP.DETAIL(id));
