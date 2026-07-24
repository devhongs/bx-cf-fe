import axios from 'axios';

import { apiErrorFromEnvelope, toApiError } from '../../../shared/ajax/api-error';
import { httpService } from '../../../shared/ajax/http.service';
import { API_CONFIG, API_URL } from '../../../shared/constants';
import { withGlobalLoading } from '../../../shared/model/loading/loading.store';

import type { LoginApiRequest, LoginRequest, LoginResponse } from '../model/auth.type';

/**
 * 로그인 — usrId + SHA-256 해시된 비밀번호로 인증.
 * 성공 시 사용자 정보 + accessToken을 반환한다. refreshToken은 HttpOnly Cookie로 관리한다.
 */
export const login = (body: LoginRequest): Promise<LoginResponse> => {
  const payload: LoginApiRequest = { data: body };
  return httpService.post<LoginResponse>('/auth/login', payload);
};

/**
 * 로그아웃.
 */
export const logout = (): Promise<void> => httpService.post<void>('/auth/logout');

/**
 * 리프레시 토큰으로 액세스 토큰을 재발급한다.
 *
 * 주의: httpService(인터셉터 포함)를 거치면 401 → refresh 재시도 로직이
 * 재귀적으로 호출될 수 있으므로, raw axios로 직접 호출한다.
 */
export const refreshTokenApi = (): Promise<LoginResponse> =>
  withGlobalLoading(async () => {
    const url = '/auth/refresh-token';
    try {
      const { data } = await axios.post(`${API_URL}${url}`, undefined, {
        headers: { 'Content-Type': 'application/json' },
        timeout: API_CONFIG.TIMEOUT,
        withCredentials: true,
      });
      if (!data?.success) throw apiErrorFromEnvelope(data ?? {}, { url });
      return data.payload as LoginResponse;
    } catch (error) {
      // httpService를 우회하므로 에러 정규화도 여기서 직접 한다.
      throw toApiError(error, { url });
    }
  });
