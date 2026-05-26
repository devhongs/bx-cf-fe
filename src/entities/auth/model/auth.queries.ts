import { queryOptions } from '@tanstack/react-query';

import { login, logout } from '../api/auth.api';
import type { Auth, AuthQueryParams } from './auth.type';

export const queryKeys = {
  login: (params?: AuthQueryParams) => ['login', params] as const,
  logout: (params?: AuthQueryParams) => ['logout', params] as const,
  checkAccessToken: ['checkAccessToken'] as const,
  checkRefreshToken: ['checkRefreshToken'] as const,
};

// 개별 Named Export와 v5 queryOptions 헬퍼 적용
export const loginQuery = <T = Auth>(params: AuthQueryParams) =>
  queryOptions({
    queryKey: queryKeys.login(params),
    queryFn: () => login<T>(params.id),
  });

export const logoutQuery = <T = Auth>(params: AuthQueryParams) =>
  queryOptions({
    queryKey: queryKeys.logout(params),
    queryFn: () => logout<T>(params.id),
  });
