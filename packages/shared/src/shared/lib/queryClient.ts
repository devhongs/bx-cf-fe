import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';

import { isApiError } from '../ajax/api-error';

import { handleApiError } from './error/handleApiError';

/**
 * 통신 에러의 중앙 처리 지점.
 * 훅(useQuery/useMutation)과 queryClient.ensureQueryData가 모두 이 캐시를 통과하므로,
 * 화면별 예외는 `meta.error`(ErrorPolicy)로만 지정하면 된다.
 */
export const createQueryClient = () =>
  new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => {
        void handleApiError(error, query.meta?.error);
      },
    }),
    mutationCache: new MutationCache({
      onError: (error, _variables, _context, mutation) => {
        void handleApiError(error, mutation.meta?.error);
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5분
        // 업무/인증 에러는 다시 보내도 결과가 같다. 서버에 닿지 못한 경우만 1회 재시도한다.
        retry: (failureCount, error) => {
          if (isApiError(error) && !['network', 'timeout', 'server'].includes(error.kind)) {
            return false;
          }
          return failureCount < 1;
        },
        refetchOnWindowFocus: false,
      },
    },
  });
