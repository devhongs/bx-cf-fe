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

export const API_CONFIG = {
  TIMEOUT: 10_000,  // 10초
  RETRY_COUNT: 1,
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/users',
    LOGOUT: '/logout',
    CHECK_ACCESS_TOKEN: '/check-access-token',
    CHECK_REFRESH_TOKEN: '/check-refresh-token',
  },
  ACCOUNT: {
    LIST: '/accounts',
    RECENT_LIST: '/recentAccounts',
    DETAIL: (accountNo: string) => `/accounts/${accountNo}`,
  },
  ALARM: {
    LIST: '/alarms',
    DETAIL: (id: number) => `/alarms/${id}`,
  },
  MENU: {
    LIST: '/menus',
    DETAIL: (id: number) => `/menus/${id}`,
  },
  PRODUCT: {
    LIST: '/products',
    DETAIL: (id: number) => `/products/${id}`,
  },
} as const;
