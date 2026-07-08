import { httpService } from '../../../shared/ajax/http.service';

import type {
  Menu,
  MenuListApiRequest,
  MenuPayload,
  MenuQueryParams,
} from '../model/menu.type';

const compact = <T extends Record<string, unknown>>(value: T): Partial<T> | undefined => {
  const entries = Object.entries(value).filter(([, item]) => item !== undefined);
  if (entries.length === 0) return undefined;
  return Object.fromEntries(entries) as Partial<T>;
};

const toMenuListApiRequest = (params?: MenuQueryParams): MenuListApiRequest | undefined => {
  if (!params) return undefined;

  const {
    page,
    size,
    offset,
    keyword,
    searchType,
    useYn,
    sort,
    id: _legacyId,
    name: _legacyName,
    iconType: _legacyIconType,
    level: _legacyLevel,
    ...data
  } = params;

  const request = compact({
    pagination: compact({ page, size, offset }),
    filter: compact({ keyword, searchType, useYn }),
    sort: compact({ sort }),
    data: compact(data),
  });

  return request as MenuListApiRequest | undefined;
};

export const fetchMenuList = <T extends Menu = Menu>(params?: MenuQueryParams): Promise<Array<T>> =>
  httpService.post<Array<T>>('/system/menus/list', toMenuListApiRequest(params));

export const fetchMenu = async <T extends Menu = Menu>(menuId: number): Promise<T> => {
  const [menu] = await fetchMenuList<T>({ menuId });
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
