/**
 * 프로젝트 전반에서 사용되는 상수들을 관리합니다.
 */

// API 관련 상수
export * from './api';
export * from './error-codes';
export * from './local-codes';
export * from './siteConfig';
export * from './storage-keys';

// process가 없는 브라우저 런타임에서도 안전하게 환경변수에 접근
const nodeEnv = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process
  ?.env?.NODE_ENV;

// 앱 전반 상수
export const APP_CONFIG = {
  NAME: 'BX-CF Frontend',
  VERSION: '1.0.0',
  ENVIRONMENT: nodeEnv || 'development',
} as const;

// 라우팅 관련 상수
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  MAIN: '/main',
  MAIN2: '/main/main2',
} as const;
