import type { UseQueryOptions } from '@tanstack/react-query'

import type { ApiResponse } from '@/shared/api/types'

import AccountService from '../api/account.api'

import type { Account, AccountsQueryParams } from './account.type'

export const queryKeys = {
  fetchList: ['accounts'] as const,
  fetch: (id: number) => ['account', id] as const,
}

export const queryOptions = {
  // 계좌 목록 조회
  fetchList: <T = Account>(
    params: AccountsQueryParams,
  ): UseQueryOptions<ApiResponse<T>> => ({
    queryKey: queryKeys.fetchList,
    queryFn: async (): Promise<ApiResponse<T>> =>
      AccountService.fetchAll(params),
  }),
  // 계좌 상세 조회
  fetch: <T = Account>(accountNo: number): UseQueryOptions<ApiResponse<T>> => ({
    queryKey: queryKeys.fetch(accountNo),
    queryFn: () => AccountService.fetch(accountNo),
  }),
}

export const mutateOptions = {
  // 계좌 생성
  create: () => ({
    mutationFn: (payload: Account) => AccountService.create(payload),
  }),
  // 계좌 수정
  update: () => ({
    mutationFn: (payload: Account) => AccountService.update(payload),
  }),
  // 계좌 삭제
  delete: () => ({
    mutationFn: (id: number) => AccountService.delete(id),
  }),
}
