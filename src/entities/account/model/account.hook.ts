import type {
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query'
import { useMutation, useQuery } from '@tanstack/react-query'

import { mutateOptions, queryOptions } from './account.queries'
import type { Account, AccountsQueryParams } from './account.type'

import type { ApiListResponse, ApiResponse } from '@/shared/api/types'

/**
 * 모든 계좌 목록을 가져오는 쿼리 훅.
 * @param params - 계좌 목록 조회 쿼리 파라미터.
 * @param options - 추가 쿼리 옵션.
 */
export const useFetchAccounts = <T = Account>(
  params: AccountsQueryParams,
  options?: UseQueryOptions<ApiListResponse<T>, Error>,
): UseQueryResult<ApiListResponse<T>, Error> => {
  return useQuery({ ...queryOptions.fetchList<T>(params), ...options })
}

/**
 * 특정 계좌 No의 계좌 정보를 가져오는 쿼리 훅.
 * @param accountNo - 조회할 계좌 No.
 */
export const useFetchAccount = <T = Account>(
  accountNo: number,
  options?: UseQueryOptions<ApiResponse<T>, Error>,
): UseQueryResult<ApiResponse<T>, Error> => {
  return useQuery({ ...queryOptions.fetch<T>(accountNo), ...options })
}

/**
 * 새로운 계좌를 생성하는 뮤테이션 훅.
 * @param [options] - 추가 뮤테이션 설정 옵션.
 */
export const useCreateCourse = (
  options?: UseMutationOptions<Account, Error, Account, unknown>,
): UseMutationResult<Account, Error, Account, unknown> => {
  return useMutation({
    ...mutateOptions.create(),
    ...options,
    onSuccess: async (data, variables, context, mutation) => {
      // await showSaveComplete()
      // 추가적인 성공 처리 로직이 있다면 실행
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context, mutation)
      }
    },
  })
}

/**
 * 기존 계좌 정보를 업데이트하는 뮤테이션 훅.
 * @param [options] - 추가 뮤테이션 설정 옵션.
 */
export const useUpdateCourse = (
  options?: UseMutationOptions<Account, Error, Account, unknown>,
): UseMutationResult<Account, Error, Account, unknown> => {
  return useMutation({
    ...mutateOptions.update(),
    ...options,
    onSuccess: async (data, variables, context, mutation) => {
      // 추가적인 성공 처리 로직이 있다면 실행
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context, mutation)
      }
    },
  })
}

/**
 * 기존 계좌를 삭제하는 뮤테이션 훅.
 * @param [options] - 추가 뮤테이션 설정 옵션.
 */
export const useDeleteCourse = (
  options?: UseMutationOptions<any, Error, number, unknown>,
): UseMutationResult<any, Error, number, unknown> => {
  // 반환 타입 any는 실제 API 응답 타입으로 명시 권장
  return useMutation({
    ...mutateOptions.delete(),
    ...options,
    onSuccess: async (data, variables, context, mutation) => {
      // await showDeleteComplete()
      // 추가적인 성공 처리 로직이 있다면 실행
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context, mutation)
      }
    },
  })
}
