import type {
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { ApiListResponse, ApiResponse } from '@/shared/api/types';

import { mutateOptions, queryOptions } from './account.queries';
import type { Account, AccountsQueryParams } from './account.type';

/**
 * 모든 계좌 목록을 가져오는 쿼리 훅.
 * @param params - 계좌 목록 조회 쿼리 파라미터.
 * @param options - 추가 쿼리 옵션.
 */
export const useFetchAccounts = <T = Account>(
  params: AccountsQueryParams,
  options?: UseQueryOptions<ApiListResponse<T>, Error>,
): UseQueryResult<ApiListResponse<T>, Error> => {
  return useQuery({ ...queryOptions.fetchList<T>(params), ...options });
};

/**
 * 특정 계좌 No의 계좌 정보를 가져오는 쿼리 훅.
 * @param accountNo - 조회할 계좌 No.
 */
export const useFetchAccount = <T = Account>(
  accountNo: string,
  options?: UseQueryOptions<ApiResponse<T>, Error>,
): UseQueryResult<ApiResponse<T>, Error> => {
  return useQuery({ ...queryOptions.fetch<T>(accountNo), ...options });
};

/**
 * 최근 보낸 계좌 정보를 가져오는 쿼리 훅.
 * @param params - 계좌 목록 조회 쿼리 파라미터.
 * @param options - 추가 쿼리 옵션.
 */
export const useFetchRecentAccounts = <T = Account>(
  params: AccountsQueryParams,
  options?: UseQueryOptions<ApiListResponse<T>, Error>,
): UseQueryResult<ApiListResponse<T>, Error> => {
  return useQuery({ ...queryOptions.fetchRecentList<T>(params), ...options });
};

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
 * 기존 계좌 정보를 업데이트하는 뮤테이션 훅.
 * @param [options] - 추가 뮤테이션 설정 옵션.
 */
export const useUpdateCourse = (
  options?: UseMutationOptions<Account, Error, Account, { previous?: unknown }>,
): UseMutationResult<Account, Error, Account, { previous?: unknown }> => {
  return useMutation({
    ...mutateOptions.update(),
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      // 추가적인 성공 처리 로직이 있다면 실행
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context, mutation);
      }
    },
  });
};

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
    onSuccess: (data, variables, context, mutation) => {
      // await showDeleteComplete()
      // 추가적인 성공 처리 로직이 있다면 실행
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context, mutation);
      }
    },
  });
};

/**
 * ✅ 대표계좌(즐겨찾기) 지정 뮤테이션 훅
 * - 토글이 아니라 "선택(select)" 개념
 * - 서버/목에서도 하나만 true가 되도록 보장
 * - 낙관적 업데이트 → 실패 시 롤백 → invalidate
 */
export const useSetFavoriteAccount = (
  options?: UseMutationOptions<void, Error, string, { previousQueries?: any }>,
): UseMutationResult<void, Error, string, { previousQueries?: any }> => {
  const queryClient = useQueryClient();

  return useMutation({
    ...mutateOptions.setFavorite(),
    // 낙관적 업데이트
    onMutate: async (accountNo) => {
      // ['accounts']로 시작하는 모든 쿼리를 취소
      await queryClient.cancelQueries({ queryKey: ['accounts'] });

      // 이전 쿼리 상태 스냅샷 저장
      const previousQueries = queryClient.getQueriesData({ queryKey: ['accounts'] });

      // 캐시 업데이트: 선택된 계좌만 true, 나머지는 false
      previousQueries.forEach(([queryKey, oldData]: any) => {
        if (!oldData) return;
        queryClient.setQueryData(queryKey, (old: any) => {
          if (!old) return old;
          return {
            ...old,
            content: (old.content ?? []).map((acc: Account) => ({
              ...acc,
              isFavorite: acc.accountNo === accountNo,
            })),
          };
        });
      });

      return { previousQueries };
    },
    onError: (_err, _vars, ctx, mutation) => {
      // 에러 발생 시 롤백
      if (ctx?.previousQueries) {
        ctx.previousQueries.forEach(([queryKey, previousData]: any) => {
          queryClient.setQueryData(queryKey, previousData);
        });
      }
      options?.onError?.(_err, _vars, ctx, mutation);
    },
    onSettled: (...args) => {
      // 서버 데이터와 동기화
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      options?.onSettled?.(...args);
    },
    onSuccess: (...args) => {
      options?.onSuccess?.(...args);
    },
  });
};
