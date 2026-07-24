import type { UseQueryOptions } from '@tanstack/react-query';

import type { HttpLoadingOptions } from '../ajax/http.service';
import type { ErrorPolicy } from '../lib/error/handleApiError';
import type { SuccessMeta } from '../lib/success/handleMutationSuccess';

export type QueryHookOptions<TQueryFnData, TData = TQueryFnData, TError = Error> = Omit<
  UseQueryOptions<TQueryFnData, TError, TData, any>,
  'queryKey' | 'queryFn'
> &
  HttpLoadingOptions;

/**
 * useQuery/useMutation의 `meta`에 넣을 수 있는 값.
 * interface가 아닌 type이어야 TanStack Query의 `Record<string, unknown>` 제약을 만족한다.
 */
export type AppQueryMeta = {
  /** 화면별 에러 처리 정책 — handleApiError가 읽는다. */
  error?: ErrorPolicy;
  /** 뮤테이션 성공 토스트 opt-in — handleMutationSuccess가 읽는다. */
  success?: SuccessMeta;
};

declare module '@tanstack/react-query' {
  interface Register {
    queryMeta: AppQueryMeta;
    mutationMeta: AppQueryMeta;
  }
}
