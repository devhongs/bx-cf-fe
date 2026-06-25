/**
 * 토큰 저장소
 * accessToken/refreshToken 및 만료시각을 localStorage에 보관한다.
 * React 외부(axios 인터셉터)에서도 접근해야 하므로 plain 모듈로 작성.
 */

import { STORAGE_KEYS } from '../../../shared/constants';
import { local } from '../../../shared/lib/utils';

import type { AuthTokens } from './auth.type';

/**
 * "yyyyMMddHHmmss" 문자열을 epoch(ms)로 변환한다.
 */
const parseExpiresAt = (value: string): number => {
  if (!/^\d{14}$/.test(value)) return Number.NaN;

  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(4, 6)) - 1;
  const day = Number(value.slice(6, 8));
  const hour = Number(value.slice(8, 10));
  const minute = Number(value.slice(10, 12));
  const second = Number(value.slice(12, 14));
  return new Date(year, month, day, hour, minute, second).getTime();
};

/**
 * 만료시각(yyyyMMddHHmmss)이 지났는지 확인한다.
 * @param expiresAt 만료시각 문자열
 * @param skewMs    여유 시간(ms). 네트워크 지연 등을 고려해 미리 만료 처리. 기본 5초.
 */
export const isExpired = (expiresAt?: string | null, skewMs = 5_000): boolean => {
  if (!expiresAt) return true;
  const expiryTime = parseExpiresAt(expiresAt);
  if (!Number.isFinite(expiryTime)) return true;
  return Date.now() >= expiryTime - skewMs;
};

export const tokenStorage = {
  get(): AuthTokens | null {
    const accessToken = local.get<string>(STORAGE_KEYS.ACCESS_TOKEN);
    const refreshToken = local.get<string>(STORAGE_KEYS.REFRESH_TOKEN);
    if (!accessToken || !refreshToken) return null;
    return {
      accessToken,
      accessTokenExpiresAt: local.get<string>(STORAGE_KEYS.ACCESS_TOKEN_EXPIRES_AT) || '',
      refreshToken,
      refreshTokenExpiresAt: local.get<string>(STORAGE_KEYS.REFRESH_TOKEN_EXPIRES_AT) || '',
    };
  },

  set(tokens: AuthTokens): void {
    local.set(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
    local.set(STORAGE_KEYS.ACCESS_TOKEN_EXPIRES_AT, tokens.accessTokenExpiresAt);
    local.set(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
    local.set(STORAGE_KEYS.REFRESH_TOKEN_EXPIRES_AT, tokens.refreshTokenExpiresAt);
  },

  clear(): void {
    local.remove(STORAGE_KEYS.ACCESS_TOKEN);
    local.remove(STORAGE_KEYS.ACCESS_TOKEN_EXPIRES_AT);
    local.remove(STORAGE_KEYS.REFRESH_TOKEN);
    local.remove(STORAGE_KEYS.REFRESH_TOKEN_EXPIRES_AT);
  },

  getAccessToken(): string | null {
    return local.get<string>(STORAGE_KEYS.ACCESS_TOKEN);
  },

  getRefreshToken(): string | null {
    return local.get<string>(STORAGE_KEYS.REFRESH_TOKEN);
  },

  getRefreshTokenExpiresAt(): string | null {
    return local.get<string>(STORAGE_KEYS.REFRESH_TOKEN_EXPIRES_AT);
  },
};

/**
 * 세션이 살아있는지(=리프레시 토큰이 아직 유효한지) 확인한다.
 * 라우트 가드에서 사용. accessToken이 만료됐어도 refreshToken이 살아있으면
 * 다음 요청 시 자동 재발급되므로 true.
 */
export const isAuthenticated = (): boolean => {
  const refreshExpiresAt = tokenStorage.getRefreshTokenExpiresAt();
  return !!tokenStorage.getRefreshToken() && !isExpired(refreshExpiresAt, 0);
};
