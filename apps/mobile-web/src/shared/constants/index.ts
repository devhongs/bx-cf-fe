/**
 * 프로젝트 전반에서 사용되는 상수들을 관리합니다.
 */

import type { BankId } from '@bx/shared';

// API 관련 상수
export * from './api';
export * from './siteConfig';
export * from './storage-keys';

// 앱 전반 상수
export const APP_CONFIG = {
  NAME: 'BX-CF Frontend',
  VERSION: '1.0.0',
  ENVIRONMENT: process.env.NODE_ENV || 'development',
} as const;

// 라우팅 관련 상수
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  MAIN: '/main',
  MAIN2: '/main/main2',
} as const;

// 은행 옵션 목록
export const BANK_OPTIONS: Array<{ id: BankId; name: string }> = [
  { id: 'KB', name: 'KB국민은행' },
  { id: 'SH', name: '신한은행' },
  { id: 'HN', name: '하나은행' },
  { id: 'WR', name: '우리은행' },
  { id: 'NH', name: 'NH농협은행' },
  { id: 'IBK', name: 'IBK기업은행' },
  { id: 'KDB', name: 'KDB산업은행' },
  { id: 'SC', name: 'SC제일은행' },
  { id: 'CT', name: '씨티은행' },
  { id: 'KT', name: '케이뱅크' },
  { id: 'KK', name: '카카오뱅크' },
  { id: 'TS', name: '토스뱅크' },
];
