import type {
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { useMutation, useQuery } from '@tanstack/react-query';

import type { ApiListResponse, ApiResponse } from '@/shared/api/types';

import { mutateOptions, queryOptions } from './menu.queries';
import type { Menu, MenuQueryParams } from './menu.type';

/**
 * 모든 메뉴 목록을 가져오는 쿼리 훅.
 * @param params - 메뉴 목록 조회 쿼리 파라미터.
 * @param options - 추가 쿼리 옵션.
 */
export const useFetchMenus = <T = Menu>(
  params?: MenuQueryParams,
  options?: UseQueryOptions<ApiListResponse<T>, Error>,
): UseQueryResult<ApiListResponse<T>, Error> => {
  return useQuery({ ...queryOptions.fetchList<T>(params), ...options });
};

/**
 * 특정 메뉴 No의 메뉴 정보를 가져오는 쿼리 훅.
 * @param accountNo - 조회할 메뉴 No.
 */
export const useFetchMenu = <T = Menu>(
  menuId: number,
  options?: UseQueryOptions<ApiResponse<T>, Error>,
): UseQueryResult<ApiResponse<T>, Error> => {
  return useQuery({ ...queryOptions.fetch<T>(menuId), ...options });
};

/**
 * 새로운 메뉴를 생성하는 뮤테이션 훅.
 * @param [options] - 추가 뮤테이션 설정 옵션.
 */
export const useCreateMenu = (
  options?: UseMutationOptions<Menu, Error, Menu, unknown>,
): UseMutationResult<Menu, Error, Menu, unknown> => {
  return useMutation({
    ...mutateOptions.create(),
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      // await showSaveComplete()
      // 추가적인 성공 처리 로직이 있다면 실행
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context, mutation);
      }
    },
  });
};

/**
 * 기존 메뉴를 삭제하는 뮤테이션 훅.
 * @param [options] - 추가 뮤테이션 설정 옵션.
 */
export const useDeleteMenu = (
  options?: UseMutationOptions<any, Error, number, unknown>,
): UseMutationResult<any, Error, number, unknown> => {
  // 반환 타입 any는 실제 API 응답 타입으로 명시 권장
  return useMutation({
    ...mutateOptions.delete(),
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      // await showDeleteComplete()
      // 추가적인 성공 처리 로직이 있다면 실행
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context, mutation);
      }
    },
  });
};
