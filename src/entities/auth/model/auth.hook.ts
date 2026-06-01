import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import type { QueryHookOptions } from '@/shared/types';

import { loginQuery, logoutQuery } from './auth.queries';
import type { Auth, AuthQueryParams } from './auth.type';

/**
 * 사용자 로그인을 가져오는 쿼리 훅.
 * @param params - 사용자 로그인 쿼리 파라미터.
 * @param options - 추가 쿼리 옵션.
 */
export const useFetchLogin = <T extends Auth = Auth>(
  params: AuthQueryParams,
  options?: QueryHookOptions<T>,
): UseQueryResult<T, Error> => {
  return useQuery({ ...options, ...loginQuery<T>(params) });
};

/**
 * 사용자 로그아웃을 가져오는 쿼리 훅.
 * @param params - 사용자 로그아웃 쿼리 파라미터.
 * @param options - 추가 쿼리 옵션.
 */
export const useFetchLogout = <T extends Auth = Auth>(
  params: AuthQueryParams,
  options?: QueryHookOptions<T>,
): UseQueryResult<T, Error> => {
  return useQuery({ ...options, ...logoutQuery<T>(params) });
};
