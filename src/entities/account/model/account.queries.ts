import type { UseQueryOptions } from '@tanstack/react-query';

import type { ApiListResponse, ApiResponse } from '@/shared/api/types';

import { AccountService } from '../api/account.api';

import type { Account, AccountsQueryParams } from './account.type';

export const queryKeys = {
  fetchList: (params?: AccountsQueryParams) => ['accounts', params] as const,
  fetch: (id: string) => ['account', id] as const,
  fetchRecentList: (params?: AccountsQueryParams) => ['recent', params] as const,
};

export const queryOptions = {
  // 계좌 목록 조회
  fetchList: <T = Account>(
    params: AccountsQueryParams,
  ): UseQueryOptions<ApiListResponse<T>> => ({
    queryKey: queryKeys.fetchList(params),
    queryFn: async (): Promise<ApiListResponse<T>> =>
      AccountService.fetchAll(params),
  }),
  // 계좌 상세 조회
  fetch: <T = Account>(accountNo: string): UseQueryOptions<ApiResponse<T>> => ({
    queryKey: queryKeys.fetch(accountNo),
    queryFn: () => AccountService.fetch(accountNo),
  }),
  fetchRecentList: <T = Account>(
    params: AccountsQueryParams,
  ): UseQueryOptions<ApiListResponse<T>> => ({
    queryKey: queryKeys.fetchRecentList(params),
    queryFn: async (): Promise<ApiListResponse<T>> =>
      AccountService.fetchRecent(params),
  }),
};

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
  // 즐겨찾기 설정
  setFavorite: () => ({
    mutationFn: (accountNo: string) => AccountService.setFavorite(accountNo),
  }),
};
