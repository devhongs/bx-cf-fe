import type { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

import { login, logout } from '../api/auth.api';
import type { Auth } from './auth.type';

/**
 * 로그인 뮤테이션 훅.
 * 사용자 액션(버튼 클릭)으로 실행되므로 useMutation 사용.
 */
export const useLogin = <T extends Auth = Auth>(
  options?: UseMutationOptions<T, Error, string>,
): UseMutationResult<T, Error, string> => {
  return useMutation({
    mutationFn: (id: string) => login<T>(id),
    ...options,
  });
};

/**
 * 로그아웃 뮤테이션 훅.
 */
export const useLogout = <T extends Auth = Auth>(
  options?: UseMutationOptions<T, Error, string>,
): UseMutationResult<T, Error, string> => {
  return useMutation({
    mutationFn: (id: string) => logout<T>(id),
    ...options,
  });
};
