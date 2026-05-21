import type { UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import type { ApiResponse } from '@/shared/api/types';

import { queryOptions } from './auth.queries';
import type { Auth, AuthQueryParams } from './auth.type';

/**
 * 사용자 로그인을 가져오는 쿼리 훅.
 * @param params - 사용자 로그인 쿼리 파라미터.
 * @param options - 추가 쿼리 옵션.
 */
export const useFetchLogin = <T = Auth>(
  params: AuthQueryParams,
  options?: UseQueryOptions<ApiResponse<T>, Error>,
): UseQueryResult<ApiResponse<T>, Error> => {
  return useQuery({ ...queryOptions.login<T>(params), ...options });
};

/**
 * 사용자 로그아웃을 가져오는 쿼리 훅.
 * @param params - 사용자 로그아웃 쿼리 파라미터.
 * @param options - 추가 쿼리 옵션.
 */
export const useFetchLogout = <T = Auth>(
  params: AuthQueryParams,
  options?: UseQueryOptions<ApiResponse<T>, Error>,
): UseQueryResult<ApiResponse<T>, Error> => {
  return useQuery({ ...queryOptions.logout<T>(params), ...options });
};
