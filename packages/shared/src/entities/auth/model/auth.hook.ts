import type { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

import { login, logout } from '../api/auth.api';

import { useAuthStore } from './auth.store';
import type { LoginRequest, LoginResponse } from './auth.type';

/**
 * 로그인 뮤테이션 훅.
 * 성공 시 인증 스토어(useAuthStore)에 사용자/토큰을 자동 저장한다.
 */
export const useLogin = (
  options?: UseMutationOptions<LoginResponse, Error, LoginRequest>,
): UseMutationResult<LoginResponse, Error, LoginRequest> => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (body: LoginRequest) => login(body),
    ...options,
    onSuccess: (...args) => {
      setAuth(args[0]);
      options?.onSuccess?.(...args);
    },
  });
};

/**
 * 로그아웃 뮤테이션 훅.
 * 서버 로그아웃 호출 후 인증 스토어를 비운다. (서버 실패와 무관하게 로컬은 정리)
 */
export const useLogout = (
  options?: UseMutationOptions<void, Error, void>,
): UseMutationResult<void, Error, void> => {
  const clearAuth = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: () => logout(),
    ...options,
    onSettled: (...args) => {
      clearAuth();
      options?.onSettled?.(...args);
    },
  });
};
