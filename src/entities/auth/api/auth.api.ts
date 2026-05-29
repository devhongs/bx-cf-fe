import type { ApiResponse } from '@/shared/api/types';
import { API_URL } from '@/shared/constants';
import { HttpJsonService } from '@/shared/lib/ajax/http.json.service';

import type { Auth } from '../model/auth.type';

/**
 * 사용자 로그인
 * @param id - 조회할 사용자 아이디.
 * @returns 로그인 상세 정보 Promise.
 */
export const login = async <T = Auth>(id: string): Promise<ApiResponse<T>> => {
  return HttpJsonService.fetch<T>(`${API_URL}/users/${id}`);
};

/**
 * 사용자 로그아웃
 * @param id - 조회할 사용자 아이디.
 * @returns 로그아웃 상세 정보 Promise.
 */
export const logout = async <T = Auth>(id: string): Promise<ApiResponse<T>> => {
  return HttpJsonService.fetch<T>(`${API_URL}/logout/${id}`);
};

/**
 * 액세스 토큰 체크
 * @param id - 조회할 사용자 아이디.
 * @returns 액세스 토큰 체크 정보 Promise.
 */
export const checkAccessToken = async <T = Auth>(id: string): Promise<ApiResponse<T>> => {
  return HttpJsonService.fetch<T>(`${API_URL}/check-access-token/${id}`);
};

/**
 * 리프레시 토큰 체크
 * @param id - 조회할 사용자 아이디.
 * @returns 리프레시 토큰 체크 정보 Promise.
 */
export const checkRefreshToken = async <T = Auth>(id: string): Promise<ApiResponse<T>> => {
  return HttpJsonService.fetch<T>(`${API_URL}/check-refresh-token/${id}`);
};

