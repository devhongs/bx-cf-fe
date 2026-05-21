/**
 * API 관련 상수들
 */

export const API_URL = 'http://localhost:3333' as const;

// API 엔드포인트 상수들
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  ACCOUNT: {
    PROFILE: '/account/profile',
    UPDATE: '/account/update',
  },
} as const;

// API 관련 설정
export const API_CONFIG = {
  TIMEOUT: 10000, // 10초
  RETRY_COUNT: 3,
} as const;
