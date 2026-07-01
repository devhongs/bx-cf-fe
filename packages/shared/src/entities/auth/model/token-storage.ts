/**
 * 토큰 저장소
 * accessToken 및 만료시각을 localStorage에 보관한다.
 * refreshToken 값은 HttpOnly Cookie로만 관리하고 JS 저장소에는 보관하지 않는다.
 * React 외부(axios 인터셉터)에서도 접근해야 하므로 plain 모듈로 작성.
 */

import { STORAGE_KEYS } from '../../../shared/constants';
import { local } from '../../../shared/lib/utils';

import type { AuthTokens } from './auth.type';

const normalizeStoredString = (value: string | null): string | null => {
  if (!value) return null;

  let normalized = value;
  while (normalized.length >= 2 && normalized.startsWith('"') && normalized.endsWith('"')) {
    normalized = normalized.slice(1, -1);
  }
  return normalized;
};

const getStoredString = (key: string): string | null => {
  if (typeof localStorage !== 'undefined') {
    return normalizeStoredString(localStorage.getItem(key));
  }
  return normalizeStoredString(local.get<string>(key));
};

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
    const accessToken = getStoredString(STORAGE_KEYS.ACCESS_TOKEN);
    if (!accessToken) return null;
    return {
      accessToken,
      accessTokenExpiresAt: getStoredString(STORAGE_KEYS.ACCESS_TOKEN_EXPIRES_AT) || '',
    };
  },

  set(tokens: AuthTokens): void {
    local.set(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
    local.set(STORAGE_KEYS.ACCESS_TOKEN_EXPIRES_AT, tokens.accessTokenExpiresAt);
    local.remove(STORAGE_KEYS.REFRESH_TOKEN);
    local.remove(STORAGE_KEYS.REFRESH_TOKEN_EXPIRES_AT);
  },

  clear(): void {
    local.remove(STORAGE_KEYS.ACCESS_TOKEN);
    local.remove(STORAGE_KEYS.ACCESS_TOKEN_EXPIRES_AT);
    local.remove(STORAGE_KEYS.REFRESH_TOKEN);
    local.remove(STORAGE_KEYS.REFRESH_TOKEN_EXPIRES_AT);
  },

  getAccessToken(): string | null {
    return getStoredString(STORAGE_KEYS.ACCESS_TOKEN);
  },

  getAccessTokenExpiresAt(): string | null {
    return getStoredString(STORAGE_KEYS.ACCESS_TOKEN_EXPIRES_AT);
  },

};

/**
 * accessToken이 현재 클라이언트 기준으로 유효한지 확인한다.
 */
export const hasValidAccessSession = (): boolean => {
  const accessToken = tokenStorage.getAccessToken();
  const accessExpiresAt = tokenStorage.getAccessTokenExpiresAt();
  return !!accessToken && !isExpired(accessExpiresAt, 0);
};
