import type { UseMutationOptions, UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { QueryHookOptions } from '../../../shared/types';

import {
  createMenuMutation,
  deleteMenuMutation,
  fetchMenuListQuery,
  fetchMenuQuery,
  menuQueryKeys,
  updateMenuMutation,
} from './menu.queries';
import type { Menu, MenuAuthParams, MenuPayload, MenuQueryParams } from './menu.type';

/**
 * 모든 메뉴 목록을 가져오는 쿼리 훅.
 * @param params - 메뉴 목록 조회 쿼리 파라미터.
 * @param options - 추가 쿼리 옵션.
 */
export const useFetchMenuList = <T extends Menu = Menu>(
  params?: MenuQueryParams,
  options?: QueryHookOptions<Array<T>>,
): UseQueryResult<Array<T>, Error> => {
  return useQuery({ ...options, ...fetchMenuListQuery<T>(params) });
};

/**
 * 특정 메뉴 No의 메뉴 정보를 가져오는 쿼리 훅.
 * @param menuId - 조회할 메뉴 ID.
 */
export const useFetchMenu = <T extends Menu = Menu>(
  menuId: number,
  options?: QueryHookOptions<T>,
): UseQueryResult<T, Error> => {
  return useQuery({ ...options, ...fetchMenuQuery<T>(menuId) });
};

/**
 * 새로운 메뉴를 생성하는 뮤테이션 훅.
 * @param [options] - 추가 뮤테이션 설정 옵션.
 */
export const useCreateMenu = (
  options?: UseMutationOptions<void, Error, { payload: MenuPayload } & MenuAuthParams, unknown>,
): UseMutationResult<void, Error, { payload: MenuPayload } & MenuAuthParams, unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    ...createMenuMutation(),
    ...options,
    onSuccess: async (data, variables, onMutateResult, context) => {
      await queryClient.invalidateQueries({ queryKey: menuQueryKeys.all });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};

export const useUpdateMenu = (
  options?: UseMutationOptions<
    void,
    Error,
    { menuId: number; payload: MenuPayload } & MenuAuthParams,
    unknown
  >,
): UseMutationResult<
  void,
  Error,
  { menuId: number; payload: MenuPayload } & MenuAuthParams,
  unknown
> => {
  const queryClient = useQueryClient();
  return useMutation({
    ...updateMenuMutation(),
    ...options,
    onSuccess: async (data, variables, onMutateResult, context) => {
      await queryClient.invalidateQueries({ queryKey: menuQueryKeys.all });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};

/**
 * 기존 메뉴를 삭제하는 뮤테이션 훅.
 * @param [options] - 추가 뮤테이션 설정 옵션.
 */
export const useDeleteMenu = (
  options?: UseMutationOptions<void, Error, { menuId: number } & MenuAuthParams, unknown>,
): UseMutationResult<void, Error, { menuId: number } & MenuAuthParams, unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    ...deleteMenuMutation(),
    ...options,
    onSuccess: async (data, variables, onMutateResult, context) => {
      await queryClient.invalidateQueries({ queryKey: menuQueryKeys.all });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
