import type { ApiListResponse, ApiResponse } from '@/shared/api/types';
import { API_URL } from '@/shared/constants';
import { HttpJsonService } from '@/shared/lib/ajax/http.json.service';

import type { Menu, MenuQueryParams } from '../model/menu.type';

/**
 * 메뉴 목록을 조회합니다.
 * @param [params] - 조회 파라미터 (선택 사항).
 * @returns 메뉴 목록 페이지네이션 응답 Promise.
 */
export const fetchMenus = async <T = Menu>(
  params?: MenuQueryParams,
): Promise<ApiListResponse<T>> => {
  return HttpJsonService.fetchAll<T>(`${API_URL}/menus`, params);
};

/**
 * 특정 ID의 메뉴를 조회합니다.
 * @param id - 조회할 메뉴 ID.
 * @returns 메뉴 상세 정보 Promise.
 */
export const fetchMenu = async <T = Menu>(id: number): Promise<ApiResponse<T>> => {
  return HttpJsonService.fetch<T>(`${API_URL}/menus/${id}`);
};

/**
 * 새로운 메뉴를 생성합니다.
 * @param payload - 생성할 메뉴 정보.
 * @returns 생성된 메뉴 정보 Promise.
 */
export const createMenu = async (payload: Menu): Promise<Menu> => {
  return HttpJsonService.post<any>(`${API_URL}/menus`, payload);
};

/**
 * 메뉴를 삭제합니다.
 * @param id - 삭제할 메뉴 ID.
 * @returns 삭제 완료 Promise.
 */
export const deleteMenu = async (id: number): Promise<any> => {
  return HttpJsonService.delete<any>(`${API_URL}/menus/${id}`);
};

