import type { UseMutationOptions, UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { QueryHookOptions } from '../../../shared/types';

import {
  accountQueryKeys,
  createAccountMutation,
  deleteAccountMutation,
  fetchAccountListQuery,
  fetchAccountQuery,
  fetchRecentAccountListQuery,
  setFavoriteAccountMutation,
  updateAccountMutation,
} from './account.queries';
import type { Account, AccountsQueryParams } from './account.type';

/**
 * 모든 계좌 목록을 가져오는 쿼리 훅.
 * @param params - 계좌 목록 조회 쿼리 파라미터.
 * @param options - 추가 쿼리 옵션.
 */
export const useFetchAccountList = <T extends Account = Account>(
  params: AccountsQueryParams,
  options?: QueryHookOptions<Array<T>>,
): UseQueryResult<Array<T>, Error> => {
  return useQuery({
    ...options,
    ...fetchAccountListQuery<T>(params),
  });
};

/**
 * 특정 계좌 No의 계좌 정보를 가져오는 쿼리 훅.
 * @param accountNo - 조회할 계좌 No.
 */
export const useFetchAccount = <T extends Account = Account>(
  accountNo: string,
  options?: QueryHookOptions<T>,
): UseQueryResult<T, Error> => {
  return useQuery({
    ...options,
    ...fetchAccountQuery<T>(accountNo),
  });
};

/**
 * 최근 보낸 계좌 정보를 가져오는 쿼리 훅.
 * @param params - 계좌 목록 조회 쿼리 파라미터.
 * @param options - 추가 쿼리 옵션.
 */
export const useFetchRecentAccountList = <T extends Account = Account>(
  params: AccountsQueryParams,
  options?: QueryHookOptions<Array<T>>,
): UseQueryResult<Array<T>, Error> => {
  return useQuery({
    ...options,
    ...fetchRecentAccountListQuery<T>(params),
  });
};

/**
 * 새로운 계좌를 생성하는 뮤테이션 훅.
 * @param [options] - 추가 뮤테이션 설정 옵션.
 */
export const useCreateAccount = (
  options?: UseMutationOptions<Account, Error, Account, unknown>,
): UseMutationResult<Account, Error, Account, unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    ...createAccountMutation(),
    ...options,
    onSuccess: async (data, variables, onMutateResult, context) => {
      await queryClient.invalidateQueries({ queryKey: accountQueryKeys.all });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};

/**
 * 기존 계좌 정보를 업데이트하는 뮤테이션 훅.
 * @param [options] - 추가 뮤테이션 설정 옵션.
 */
export const useUpdateAccount = (
  options?: UseMutationOptions<Account, Error, Account, { previous?: unknown }>,
): UseMutationResult<Account, Error, Account, { previous?: unknown }> => {
  const queryClient = useQueryClient();
  return useMutation({
    ...updateAccountMutation(),
    ...options,
    onSuccess: async (data, variables, onMutateResult, context) => {
      await queryClient.invalidateQueries({ queryKey: accountQueryKeys.all });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};

/**
 * 기존 계좌를 삭제하는 뮤테이션 훅.
 * @param [options] - 추가 뮤테이션 설정 옵션.
 */
export const useDeleteAccount = (
  options?: UseMutationOptions<void, Error, string, unknown>,
): UseMutationResult<void, Error, string, unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    ...deleteAccountMutation(),
    ...options,
    onSuccess: async (data, variables, onMutateResult, context) => {
      await queryClient.invalidateQueries({ queryKey: accountQueryKeys.all });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};

/**
 * ✅ 대표계좌(즐겨찾기) 지정 뮤테이션 훅
 * - 토글이 아니라 "선택(select)" 개념
 * - 서버/목에서도 하나만 true가 되도록 보장
 * - API 레이어에 존재하던 다중 동기화 비즈니스를 Hook 레이어로 이관 완료
 * - 낙관적 업데이트 → 실패 시 롤백 → invalidate
 */
export const useSetFavoriteAccount = (
  options?: UseMutationOptions<void, Error, string, any>,
): UseMutationResult<void, Error, string, any> => {
  const queryClient = useQueryClient();
  const mutationHelper = setFavoriteAccountMutation();

  return useMutation({
    mutationKey: ['setFavoriteAccount'],
    mutationFn: async (accountNo: string) => {
      // 1) 캐시 또는 API를 통해 현재 계좌 전체 목록 조회
      // 낙관적 업데이트에 캐시가 있을 것이므로 캐시 상태를 가져오거나 없으면 새로 패치합니다.
      const cachedQueries = queryClient.getQueriesData<Array<Account>>({
        queryKey: ['account', 'list'],
      });

      let items: Account[] = [];
      for (const [_, data] of cachedQueries) {
        if (data) {
          items = data as Account[];
          break;
        }
      }

      // 2) 즐겨찾기를 켤 타깃 계좌 탐색
      const target = items.find((a) => a.accountNo === accountNo);
      if (!target) {
        throw new Error('Account not found in cache');
      }

      // 3) 이미 true인 다른 계좌들 false로 변경하기 위해 순차/동시 PATCH 요청
      const otherFavorites = items.filter((a) => a.isFavorite && a.accountNo !== accountNo);

      // 다중 PATCH를 순차/병렬 처리하여 즐겨찾기 해제
      await Promise.all(
        otherFavorites.map((acc) =>
          mutationHelper.mutationFn({ id: (acc as any).id, isFavorite: false }),
        ),
      );

      // 4) 타깃 계좌의 즐겨찾기 true로 설정
      await mutationHelper.mutationFn({ id: (target as any).id, isFavorite: true });
    },
    // 낙관적 업데이트
    onMutate: async (accountNo: string) => {
      // ['account']로 시작하는 모든 쿼리를 취소
      await queryClient.cancelQueries({
        queryKey: accountQueryKeys.all,
      });

      // 이전 쿼리 상태 스냅샷 저장
      const previousQueries = queryClient.getQueriesData({
        queryKey: accountQueryKeys.all,
      });

      // 캐시 업데이트: 선택된 계좌만 true, 나머지는 false
      for (const [queryKey, oldData] of previousQueries as any) {
        if (!oldData) continue;
        queryClient.setQueryData(queryKey, (old: any) => {
          if (!old) return old;
          return old.map((acc: Account) => ({
            ...acc,
            isFavorite: acc.accountNo === accountNo,
          }));
        });
      }

      return { previousQueries };
    },
    onError: (err: any, vars: any, onMutateResult: any, ctx: any) => {
      // 에러 발생 시 롤백
      if (onMutateResult?.previousQueries) {
        for (const [queryKey, previousData] of onMutateResult.previousQueries as any) {
          queryClient.setQueryData(queryKey, previousData);
        }
      }
      options?.onError?.(err, vars, onMutateResult, ctx);
    },
    onSettled: (data: any, error: any, variables: any, onMutateResult: any, ctx: any) => {
      // 서버 데이터와 동기화
      queryClient.invalidateQueries({ queryKey: accountQueryKeys.all });
      options?.onSettled?.(data, error, variables, onMutateResult, ctx);
    },
    onSuccess: (data: any, variables: any, onMutateResult: any, ctx: any) => {
      options?.onSuccess?.(data, variables, onMutateResult, ctx);
    },
  } as any);
};
