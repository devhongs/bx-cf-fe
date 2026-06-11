/**
 * API 관련 상수
 *
 * VITE_API_URL 은 각 앱의 .env 파일에서 주입됩니다.
 *   - mock 서버(mock/server.js): http://localhost:3333
 *   - 실서버(Spring):            http://localhost:18081/channel/backend/api/v1
 * 두 백엔드 모두 동일한 envelope/JWT 계약을 따르므로 앱 코드는 동일하게 동작합니다.
 */
export const API_URL: string =
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore — import.meta.env는 Vite 앱 빌드 시 주입됨
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) || 'http://localhost:3333';

export const API_CONFIG = {
  TIMEOUT: 10_000, // 10초
  RETRY_COUNT: 1,
} as const;
