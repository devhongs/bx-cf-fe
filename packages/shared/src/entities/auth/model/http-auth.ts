/**
 * httpService에 주입할 인증 설정 생성기.
 * 토큰 부착 / 401 재발급 / 인증 실패 처리를 entities/auth 모듈과 연결한다.
 *
 * apps/[app]/src/main.tsx에서:
 *   httpService.init({ ..., auth: createHttpAuthConfig() })
 */

import type { HttpAuthConfig } from '../../../shared/ajax/http.service';
import { refreshTokenApi } from '../api/auth.api';

import { useAuthStore } from './auth.store';
import { isExpired, tokenStorage } from './token-storage';

const getAppBasePath = (): string =>
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore — import.meta.env는 Vite 앱 빌드 시 주입됨
  (typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL) || '/';

export const getLoginPath = (basePath = getAppBasePath()): string => {
  const normalizedBase = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
  return `${normalizedBase || ''}/login`;
};

export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const res = await refreshTokenApi();
    useAuthStore.getState().setAuth(res);
    return res.accessToken;
  } catch {
    return null;
  }
};

export const ensureValidAuthSession = async (): Promise<boolean> => {
  const accessExpiresAt = tokenStorage.getAccessTokenExpiresAt();
  if (tokenStorage.getAccessToken() && !isExpired(accessExpiresAt, 0)) return true;

  return !!(await refreshAccessToken());
};

export const createHttpAuthConfig = (): HttpAuthConfig => ({
  // 매 요청에 부착할 액세스 토큰
  getAccessToken: () => tokenStorage.getAccessToken(),

  // 401 발생 시 호출 — 성공하면 새 액세스 토큰, 실패하면 null 반환
  refreshToken: refreshAccessToken,

  // 재발급까지 실패한 경우 — 세션 정리 후 로그인 페이지로 이동
  onAuthFail: () => {
    useAuthStore.getState().logout();
    if (typeof window !== 'undefined') {
      window.location.href = getLoginPath();
    }
  },
});
