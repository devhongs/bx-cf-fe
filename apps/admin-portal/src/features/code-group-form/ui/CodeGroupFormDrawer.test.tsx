// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { CodeGroupFormDrawer } from './CodeGroupFormDrawer';

const mutation = {
  isPending: false,
  mutateAsync: vi.fn(),
};

const { toastSuccess } = vi.hoisted(() => ({ toastSuccess: vi.fn() }));

vi.mock('@bx/shared', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@bx/shared')>();

  return {
    ...actual,
    toast: { success: toastSuccess },
    useCreateCommonCodeGroup: () => mutation,
    useDeleteCommonCodeGroup: () => mutation,
    useFetchCommonCodeGroup: (groupCd: string) => ({
      data: groupCd
        ? [
            {
              groupCd,
              groupNm: '사용 여부',
              useYn: 'Y',
              codes: [{ groupCd, code: 'Y', codeNm: '사용', sortSeq: 1, useYn: 'Y' }],
            },
          ]
        : undefined,
    }),
    useReplaceCommonCodes: () => mutation,
  };
});

vi.mock('@/shared/ui/admin-drawer/AdminDrawer', () => ({
  AdminDrawer: ({ children, footer }: { children: ReactNode; footer: ReactNode }) => (
    <div>
      {children}
      <footer>{footer}</footer>
    </div>
  ),
}));

afterEach(cleanup);

describe('CodeGroupFormDrawer', () => {
  it('그룹 상세 응답의 codes로 코드 행을 채운다', () => {
    render(<CodeGroupFormDrawer open groupCd="USE_YN" onClose={vi.fn()} />);

    expect(document.querySelector<HTMLInputElement>('input[name="codes.0.code"]')?.value).toBe('Y');
    expect(document.querySelector<HTMLInputElement>('input[name="codes.0.codeNm"]')?.value).toBe(
      '사용',
    );
  });

  it('코드 추가를 소프트 강조 아이콘 액션으로 렌더링한다', () => {
    render(<CodeGroupFormDrawer open onClose={vi.fn()} />);

    const addButton = screen.getByRole('button', { name: '코드 추가' });

    expect(addButton.className).toContain('outline');
    expect(addButton.className).toContain('sizeSm');
    expect(addButton.className).toContain('addButton');
    expect(addButton.querySelector('svg')).not.toBeNull();
  });

  it('행 삭제를 휴지통 아이콘 액션으로 렌더링한다', () => {
    render(<CodeGroupFormDrawer open onClose={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: '코드 추가' }));

    const removeButton = screen.getByRole('button', { name: '1번째 코드 삭제' });

    expect(removeButton.className).toContain('removeButton');
    expect(removeButton.querySelector('svg')).not.toBeNull();
  });

  it('선택한 코드 행만 삭제한다', () => {
    render(<CodeGroupFormDrawer open onClose={vi.fn()} />);

    const addButton = screen.getByRole('button', { name: '코드 추가' });
    fireEvent.click(addButton);
    fireEvent.click(addButton);

    const firstCode = document.querySelector<HTMLInputElement>('input[name="codes.0.code"]');
    const secondCode = document.querySelector<HTMLInputElement>('input[name="codes.1.code"]');

    expect(firstCode).not.toBeNull();
    expect(secondCode).not.toBeNull();
    fireEvent.change(firstCode!, { target: { value: 'FIRST' } });
    fireEvent.change(secondCode!, { target: { value: 'SECOND' } });

    fireEvent.click(screen.getByRole('button', { name: '1번째 코드 삭제' }));

    expect(document.querySelector<HTMLInputElement>('input[name="codes.0.code"]')?.value).toBe(
      'SECOND',
    );
    expect(document.querySelector('input[name="codes.1.code"]')).toBeNull();
  });

  it('저장 성공 시 드로어를 닫고 토스트는 직접 띄우지 않는다', async () => {
    const handleClose = vi.fn();
    mutation.mutateAsync.mockResolvedValue(undefined);
    toastSuccess.mockReset();

    render(<CodeGroupFormDrawer open onClose={handleClose} />);

    fireEvent.change(screen.getByLabelText(/그룹코드/), { target: { value: 'TEST_GROUP' } });
    fireEvent.change(screen.getByLabelText(/그룹명/), { target: { value: '테스트 그룹' } });
    fireEvent.click(screen.getByRole('button', { name: '저장' }));

    await waitFor(() => {
      expect(handleClose).toHaveBeenCalledOnce();
    });
    // 성공 토스트는 이제 공통(MutationCache + meta.success)이 담당한다.
    expect(toastSuccess).not.toHaveBeenCalled();
  });
});
