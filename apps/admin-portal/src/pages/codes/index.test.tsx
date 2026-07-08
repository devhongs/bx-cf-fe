// @vitest-environment jsdom

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { CodesPage } from './index';

vi.mock('@bx/shared', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@bx/shared')>();

  return {
    ...actual,
    commonCodeGroupListQuery: () => ({
      queryKey: ['common-code', 'groups', 'list'],
      queryFn: async () => [
        {
          groupId: 1,
          groupCd: 'USE_YN',
          groupNm: '사용 여부',
          groupDesc: '사용/미사용 상태 공통 코드',
          systemYn: 'Y',
          useYn: 'Y',
        },
        {
          groupId: 2,
          groupCd: 'USER_TYPE',
          groupNm: '사용자 유형',
          groupDesc: '관리자와 서비스 사용자 구분',
          systemYn: 'N',
          useYn: 'Y',
        },
      ],
    }),
    commonCodeListQuery: (groupCd: string) => ({
      queryKey: ['common-code', 'codes', groupCd, 'list'],
      queryFn: async () =>
        groupCd === 'USE_YN'
          ? [
              { groupCd, code: 'Y', codeNm: '사용', sortSeq: 1, useYn: 'Y' },
              { groupCd, code: 'N', codeNm: '미사용', sortSeq: 2, useYn: 'Y' },
            ]
          : [{ groupCd, code: 'ADMIN', codeNm: '관리자', sortSeq: 1, useYn: 'Y' }],
    }),
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
