// @vitest-environment jsdom

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { CodesPage } from './index';

const mockCommonCodeData = vi.hoisted(() => {
  const useYnGroup = {
    groupId: 1,
    groupCd: 'USE_YN',
    groupNm: '사용 여부',
    groupDesc: '사용/미사용 상태 공통 코드',
    systemYn: 'Y',
    useYn: 'Y',
  };
  const userTypeGroup = {
    groupId: 2,
    groupCd: 'USER_TYPE',
    groupNm: '사용자 유형',
    groupDesc: '관리자와 서비스 사용자 구분',
    systemYn: 'N',
    useYn: 'Y',
  };

  return {
    groups: [useYnGroup, userTypeGroup],
    details: {
      USE_YN: [useYnGroup],
      USER_TYPE: [userTypeGroup],
    },
    codes: {
      USE_YN: [
        { groupCd: 'USE_YN', code: 'Y', codeNm: '사용', sortSeq: 1, useYn: 'Y' },
        { groupCd: 'USE_YN', code: 'N', codeNm: '미사용', sortSeq: 2, useYn: 'Y' },
      ],
      USER_TYPE: [
        { groupCd: 'USER_TYPE', code: 'ADMIN', codeNm: '관리자', sortSeq: 1, useYn: 'Y' },
      ],
    },
  };
});

vi.mock('@bx/shared', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@bx/shared')>();

  return {
    ...actual,
    useFetchCommonCodeGroupList: () => ({
      data: mockCommonCodeData.groups,
    }),
    useFetchCommonCodeGroup: (groupCd: string) => ({
      data: mockCommonCodeData.details[groupCd as keyof typeof mockCommonCodeData.details] ?? [],
    }),
    useFetchCommonCodeList: (groupCd: string) => ({
      data: mockCommonCodeData.codes[groupCd as keyof typeof mockCommonCodeData.codes] ?? [],
    }),
    useCreateCommonCodeGroup: () => ({ isPending: false, mutateAsync: vi.fn() }),
    useUpdateCommonCodeGroup: () => ({ isPending: false, mutateAsync: vi.fn() }),
    useDeleteCommonCodeGroup: () => ({ isPending: false, mutateAsync: vi.fn() }),
  };
});

const renderCodesPage = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <CodesPage />
    </QueryClientProvider>,
  );
};

describe('CodesPage', () => {
  afterEach(() => {
    cleanup();
  });

  it('opens a drawer with the selected group detail and code list', async () => {
    renderCodesPage();

    expect(screen.queryByRole('dialog')).toBeNull();

    fireEvent.click(await screen.findByText('USE_YN'));

    expect(screen.getByRole('dialog', { name: '사용 여부' })).toBeTruthy();
    expect(screen.getByText('코드 목록')).toBeTruthy();
    await waitFor(() => {
      expect(screen.getAllByText('미사용').length).toBeGreaterThan(0);
    });

    fireEvent.click(await screen.findByText('USER_TYPE'));

    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: '사용자 유형' })).toBeTruthy();
      expect(screen.getAllByText('관리자').length).toBeGreaterThan(0);
    });
  });
});
