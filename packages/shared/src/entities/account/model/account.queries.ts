import { queryOptions } from '@tanstack/react-query';

import {
  createAccount,
  deleteAccount,
  fetchAccount,
  fetchAccountList,
  fetchRecentAccountList,
  updateAccount,
  updateAccountFavorite,
} from '../api/account.api';
import type { Account, AccountsQueryParams } from './account.type';

export const accountQueryKeys = {
  all: ['account'] as const,
  list: (params?: AccountsQueryParams) => ['account', 'list', params] as const,
  recentList: (params?: AccountsQueryParams) => ['account', 'recent', params] as const,
  detail: (id: string) => ['account', 'detail', id] as const,
};

// 개별 Named Export와 v5 queryOptions 헬퍼 적용
export const fetchAccountListQuery = <T extends Account = Account>(params: AccountsQueryParams) =>
  queryOptions({
    queryKey: accountQueryKeys.list(params),
    queryFn: () => fetchAccountList<T>(params),
  });

export const fetchAccountQuery = <T extends Account = Account>(accountNo: string) =>
  queryOptions({
    queryKey: accountQueryKeys.detail(accountNo),
    queryFn: () => fetchAccount<T>(accountNo),
  });

export const fetchRecentAccountListQuery = <T extends Account = Account>(params: AccountsQueryParams) =>
  queryOptions({
    queryKey: accountQueryKeys.recentList(params),
    queryFn: () => fetchRecentAccountList<T>(params),
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
