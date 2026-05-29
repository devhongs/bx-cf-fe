import { API_URL } from '@/shared/constants';
import { httpService } from '@/shared/lib/ajax/http.service';

import type { Menu, MenuQueryParams } from '../model/menu.type';

/**
 * 메뉴 목록을 조회합니다.
 * @param [params] - 조회 파라미터 (선택 사항).
 * @returns 메뉴 목록 응답 Promise.
 */
export const fetchMenus = <T extends Menu = Menu>(
  params?: MenuQueryParams,
): Promise<Array<T>> =>
  httpService.get<Array<T>>(`${API_URL}/menus`, params);

/**
 * 특정 ID의 메뉴를 조회합니다.
 * @param id - 조회할 메뉴 ID.
 * @returns 메뉴 상세 정보 Promise.
 */
export const fetchMenu = <T extends Menu = Menu>(id: number): Promise<T> =>
  httpService.get<T>(`${API_URL}/menus/${id}`);

/**
 * 새로운 메뉴를 생성합니다.
 * @param payload - 생성할 메뉴 정보.
 * @returns 생성된 메뉴 정보 Promise.
 */
export const createMenu = (payload: Menu): Promise<Menu> =>
  httpService.post<Menu>(`${API_URL}/menus`, payload);

/**
 * 메뉴를 삭제합니다.
 * @param id - 삭제할 메뉴 ID.
 * @returns 삭제 완료 Promise.
 */
export const deleteMenu = (id: number): Promise<void> =>
  httpService.delete<void>(`${API_URL}/menus/${id}`);
