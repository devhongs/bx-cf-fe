import { API_URL } from '../../../shared/constants';
import { httpService } from '../../../shared/ajax/http.service';

import type { Auth } from '../model/auth.type';

/**
 * 사용자 로그인
 * @param id - 조회할 사용자 아이디.
 * @returns 로그인 상세 정보 Promise.
 */
export const login = <T extends Auth = Auth>(id: string): Promise<T> =>
  httpService.get<T>(`${API_URL}/users/${id}`);

/**
 * 사용자 로그아웃
 * @param id - 조회할 사용자 아이디.
 * @returns 로그아웃 상세 정보 Promise.
 */
export const logout = <T extends Auth = Auth>(id: string): Promise<T> =>
  httpService.get<T>(`${API_URL}/logout/${id}`);

/**
 * 액세스 토큰 체크
 * @param id - 조회할 사용자 아이디.
 * @returns 액세스 토큰 체크 정보 Promise.
 */
export const checkAccessToken = <T extends Auth = Auth>(id: string): Promise<T> =>
  httpService.get<T>(`${API_URL}/check-access-token/${id}`);

/**
 * 리프레시 토큰 체크
 * @param id - 조회할 사용자 아이디.
 * @returns 리프레시 토큰 체크 정보 Promise.
 */
export const checkRefreshToken = <T extends Auth = Auth>(id: string): Promise<T> =>
  httpService.get<T>(`${API_URL}/check-refresh-token/${id}`);
