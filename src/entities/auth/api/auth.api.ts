import type { ApiResponse } from '@/shared/api/types';
import { API_URL } from '@/shared/constants';
import HttpJsonService from '@/shared/lib/ajax/http.json.service';

import type { Auth } from '../model/auth.type';

/**
 * 메뉴 관련 API 요청을 처리하는 서비스 클래스.
 */
export default class AuthService {
  /**
   * 사용자 로그인
   * @param id - 조회할 사용자 아이디.
   * @returns 메뉴 상세 정보 Promise.
   */
  static async login<T = Auth>(id: string): Promise<ApiResponse<T>> {
    // return httpService.get<T>(`${API_URL}//login/${accountNo}`)
    return HttpJsonService.fetch<T>(`${API_URL}/login/?id=${id}`);
  }

  /**
   * 사용자 로그아웃
   * @param id - 조회할 사용자 아이디.
   * @returns 메뉴 상세 정보 Promise.
   */
  static async logout<T = Auth>(id: string): Promise<ApiResponse<T>> {
    // return httpService.get<T>(`${API_URL}//login/${accountNo}`)
    return HttpJsonService.fetch<T>(`${API_URL}/logout/?id=${id}`);
  }

  /**
   * 액세스 토큰 체크
   * @param id - 조회할 사용자 아이디.
   * @returns 액세스 토큰 체크 정보 Promise.
   */
  static async checkAccessToken<T = Auth>(id: string): Promise<ApiResponse<T>> {
    // return httpService.get<T>(`${API_URL}//login/${accountNo}`)
    return HttpJsonService.fetch<T>(`${API_URL}/check-access-token/?id=${id}`);
  }

  /**
   * 리프레시 토큰 체크
   * @param id - 조회할 사용자 아이디.
   * @returns 리프레시 토큰 체크 정보 Promise.
   */
  static async checkRefreshToken<T = Auth>(
    id: string,
  ): Promise<ApiResponse<T>> {
    // return httpService.get<T>(`${API_URL}//login/${accountNo}`)
    return HttpJsonService.fetch<T>(`${API_URL}/check-refresh-token/?id=${id}`);
  }
}
