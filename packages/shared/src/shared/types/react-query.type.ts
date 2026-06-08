import type { UseQueryOptions } from '@tanstack/react-query';

export type QueryHookOptions<TQueryFnData, TData = TQueryFnData, TError = Error> = Omit<
  UseQueryOptions<TQueryFnData, TError, TData, any>,
  'queryKey' | 'queryFn'
>;
