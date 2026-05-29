import { queryOptions } from '@tanstack/react-query';

import {
  createAccount,
  deleteAccount,
  fetchAccount,
  fetchAccounts,
  fetchRecentAccounts,
  updateAccount,
  updateAccountFavorite,
} from '../api/account.api';
import type { Account, AccountsQueryParams } from './account.type';

export const queryKeys = {
  fetchList: (params?: AccountsQueryParams) => ['accounts', params] as const,
  fetch: (id: string) => ['account', id] as const,
  fetchRecentList: (params?: AccountsQueryParams) => ['recent', params] as const,
};

// 개별 Named Export와 v5 queryOptions 헬퍼 적용
export const fetchAccountsQuery = <T extends Account = Account>(params: AccountsQueryParams) =>
  queryOptions({
    queryKey: queryKeys.fetchList(params),
    queryFn: () => fetchAccounts<T>(params),
  });

export const fetchAccountQuery = <T extends Account = Account>(accountNo: string) =>
  queryOptions({
    queryKey: queryKeys.fetch(accountNo),
    queryFn: () => fetchAccount<T>(accountNo),
  });

export const fetchRecentAccountsQuery = <T extends Account = Account>(params: AccountsQueryParams) =>
  queryOptions({
    queryKey: queryKeys.fetchRecentList(params),
    queryFn: () => fetchRecentAccounts<T>(params),
  });

// 계좌 생성 뮤테이션 옵션
export const createAccountMutation = () => ({
  mutationFn: (payload: Account) => createAccount(payload),
});

// 계좌 수정 뮤테이션 옵션
export const updateAccountMutation = () => ({
  mutationFn: (payload: Account) => updateAccount(payload),
});

// 계좌 삭제 뮤테이션 옵션
export const deleteAccountMutation = () => ({
  mutationFn: (id: string) => deleteAccount(id),
});

// 즐겨찾기 설정 뮤테이션 옵션 (단일 타깃 ID에 대해 즐겨찾기 설정/해제 트리거)
export const setFavoriteAccountMutation = () => ({
  mutationFn: ({ id, isFavorite }: { id: string; isFavorite: boolean }) =>
    updateAccountFavorite(id, isFavorite),
});
