/**
 * API 관련 상수
 *
 * VITE_API_URL 은 각 앱의 .env 파일에서 주입됩니다.
 *   apps/mobile-web/.env  →  VITE_API_URL=http://localhost:3333
 *   apps/pc-web/.env      →  VITE_API_URL=http://localhost:3333
 */
export const API_URL: string =
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore — import.meta.env는 Vite 앱 빌드 시 주입됨
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
  'http://localhost:3333';

// json-server(mock) 여부 — { success, code, msg, payload } 포맷이 아닌 응답을 보정하기 위해 사용
export const IS_MOCK_API = API_URL.includes('localhost:3333');

export const API_CONFIG = {
  TIMEOUT: 10_000,  // 10초
  RETRY_COUNT: 1,
} as const;
