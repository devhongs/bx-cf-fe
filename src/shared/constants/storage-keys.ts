/**
 * Storage Keys
 * sessionStorage, localStorage, IndexedDB에서 사용하는 키 상수 관리
 */

export const STORAGE_KEYS = {
  // 인증 관련
  SESSION_ID: 'sessionId',
  USER_ID: 'userId',
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',

  // 사용자 설정
  USER_PREFERENCES: 'userPreferences',
  USER_SETTINGS: 'userSettings',
  THEME: 'theme',
  LANGUAGE: 'language',

  // 임시 데이터
  TEMP_DATA: 'tempData',
  FORM_DATA: 'formData',

  // 캐시/오프라인
  CACHE_DATA: 'cacheData',
  OFFLINE_DATA: 'offlineData',

  // 일자
  TX_DT: 'txDt',
} as const;

// 스토리지 키 타입
export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
