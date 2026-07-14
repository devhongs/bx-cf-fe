import { httpService } from '../../../shared/ajax/http.service';

import type { Menu, MenuAuthParams, MenuPayload, MenuQueryParams } from '../model/menu.type';

export const fetchMenuList = <T extends Menu = Menu>(
  _params?: MenuQueryParams,
): Promise<Array<T>> => httpService.post<Array<T>>('/system/menus/list');

export const fetchMenu = <T extends Menu = Menu>(menuId: number): Promise<T> =>
  httpService.post<T>(`/system/menus/${encodeURIComponent(menuId)}/detail`);

const authUserHeader = ({ authUser }: MenuAuthParams) => ({
  headers: { 'X-Auth-User': authUser },
});

export const createMenu = (payload: MenuPayload, authUser: string): Promise<void> =>
  httpService.post<void>('/system/menus/create', { data: payload }, authUserHeader({ authUser }));

export const updateMenu = (menuId: number, payload: MenuPayload, authUser: string): Promise<void> =>
  httpService.post<void>(
    `/system/menus/${encodeURIComponent(menuId)}/update`,
    {
      data: payload,
    },
    authUserHeader({ authUser }),
  );

export const deleteMenu = (menuId: number, authUser: string): Promise<void> =>
  httpService.post<void>(
    `/system/menus/${encodeURIComponent(menuId)}/delete`,
    undefined,
    authUserHeader({ authUser }),
  );
