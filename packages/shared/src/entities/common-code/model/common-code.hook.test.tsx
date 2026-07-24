// @vitest-environment jsdom

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { httpService } from '../../../shared/ajax/http.service';

import {
  useFetchCommonCodeGroup,
  useFetchCommonCodeGroupList,
  useReplaceCommonCodes,
} from './common-code.hook';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('common code mutation invalidation', () => {
  it('replace 성공 후 목록만 다시 조회하고 활성 상세는 stale 처리만 한다', async () => {
    const postSpy = vi.spyOn(httpService, 'post').mockImplementation(async (url) => {
      if (url === '/system/common-codes/groups/list') {
        return [{ groupCd: 'USE_YN', groupNm: '사용 여부', useYn: 'Y' }];
      }
      if (url === '/system/common-codes/USE_YN/detail') {
        return {
          groupCd: 'USE_YN',
          groupNm: '사용 여부',
          useYn: 'Y',
          codes: [{ groupCd: 'USE_YN', code: 'Y', codeNm: '사용', useYn: 'Y' }],
        };
      }
      if (url === '/system/common-codes/USE_YN/replace') {
        return undefined;
      }
      throw new Error(`Unexpected URL: ${url}`);
    });
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
    const listHook = renderHook(() => useFetchCommonCodeGroupList(), { wrapper });
    const detailHook = renderHook(() => useFetchCommonCodeGroup('USE_YN'), { wrapper });
    const replaceHook = renderHook(() => useReplaceCommonCodes(), { wrapper });

    await waitFor(() => {
      expect(listHook.result.current.isSuccess).toBe(true);
      expect(detailHook.result.current.isSuccess).toBe(true);
    });

    await act(async () => {
      await replaceHook.result.current.mutateAsync({
        groupCd: 'USE_YN',
        payload: {
          groupNm: '사용 여부',
          useYn: 'Y',
          codes: [{ code: 'Y', codeNm: '사용', useYn: 'Y' }],
        },
      });
    });

    const requestedUrls = postSpy.mock.calls.map(([url]) => url);
    expect(requestedUrls.filter((url) => url === '/system/common-codes/groups/list')).toHaveLength(
      2,
    );
    expect(
      requestedUrls.filter((url) => url === '/system/common-codes/USE_YN/detail'),
    ).toHaveLength(1);
    expect(
      queryClient.getQueryState(['common-code', 'groups', 'detail', 'USE_YN'])?.isInvalidated,
    ).toBe(true);
  });
});

describe('common code detail freshness', () => {
  it('상세 조회는 비활성화 후 다시 활성화되면 캐시가 있어도 재조회한다', async () => {
    const postSpy = vi.spyOn(httpService, 'post').mockResolvedValue({
      groupCd: 'USE_YN',
      groupNm: '사용 여부',
      useYn: 'Y',
      codes: [{ groupCd: 'USE_YN', code: 'Y', codeNm: '사용', useYn: 'Y' }],
    });
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          staleTime: 1000 * 60 * 5,
        },
      },
    });
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
    const detailHook = renderHook(
      ({ open }) => useFetchCommonCodeGroup('USE_YN', { enabled: open }),
      {
        wrapper,
        initialProps: { open: true },
      },
    );

    await waitFor(() => {
      expect(detailHook.result.current.isSuccess).toBe(true);
    });

    detailHook.rerender({ open: false });
    detailHook.rerender({ open: true });

    await waitFor(() => {
      expect(postSpy).toHaveBeenCalledTimes(2);
    });
  });
});

describe('common code loading options', () => {
  it('조회 훅의 showSpinner 옵션을 HTTP 요청에 전달한다', async () => {
    const postSpy = vi.spyOn(httpService, 'post').mockResolvedValue([]);
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const listHook = renderHook(
      () => useFetchCommonCodeGroupList(undefined, { showSpinner: false }),
      { wrapper },
    );

    await waitFor(() => {
      expect(listHook.result.current.isSuccess).toBe(true);
    });

    expect(postSpy).toHaveBeenCalledWith('/system/common-codes/groups/list', undefined, {
      showSpinner: false,
    });
  });
});
