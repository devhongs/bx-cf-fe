import type { UseQueryOptions } from '@tanstack/react-query';

import type { ApiResponse } from '@/shared/api/types';

import { AuthService } from '../api/auth.api';

import type { Auth, AuthQueryParams } from './auth.type';

export const queryKeys = {
  login: (params?: AuthQueryParams) => ['login', params] as const,
  logout: (params?: AuthQueryParams) => ['logout', params] as const,
  checkAccessToken: ['checkAccessToken'] as const,
  checkRefreshToken: ['checkRefreshToken'] as const,
};

export const queryOptions = {
  // 사용자 로그인
  login: <T = Auth>(
    params: AuthQueryParams,
  ): UseQueryOptions<ApiResponse<T>> => ({
    queryKey: queryKeys.login(params),
    queryFn: async (): Promise<ApiResponse<T>> => AuthService.login(params.id),
  }),
  // 사용자 로그아웃
  logout: <T = Auth>(
    params: AuthQueryParams,
  ): UseQueryOptions<ApiResponse<T>> => ({
    queryKey: queryKeys.logout(params),
    queryFn: async (): Promise<ApiResponse<T>> => AuthService.logout(params.id),
  }),
};
