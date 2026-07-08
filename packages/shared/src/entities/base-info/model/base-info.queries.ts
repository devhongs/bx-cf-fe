import { type QueryClient, queryOptions } from '@tanstack/react-query';

import { type BaseInfoBootstrapOptions, bootstrapBaseInfoSafe } from './base-info.bootstrap';

const DEFAULT_MENU_CACHE_SCOPE = 'global';

export const baseInfoQueryKeys = {
  all: ['base-info'] as const,
  bootstrap: (menuCacheScope = DEFAULT_MENU_CACHE_SCOPE) =>
    ['base-info', 'bootstrap', menuCacheScope] as const,
};

export const baseInfoBootstrapQuery = (options?: BaseInfoBootstrapOptions) =>
  queryOptions({
    queryKey: baseInfoQueryKeys.bootstrap(options?.menuCacheScope),
    queryFn: () => bootstrapBaseInfoSafe(options),
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
  });

export const ensureBaseInfoBootstrapped = (
  queryClient: QueryClient,
  options?: BaseInfoBootstrapOptions,
) => queryClient.ensureQueryData(baseInfoBootstrapQuery(options));
