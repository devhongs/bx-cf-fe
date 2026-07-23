// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { CodeGroupFormDrawer } from './CodeGroupFormDrawer';

const mutation = {
  isPending: false,
  mutateAsync: vi.fn(),
};

vi.mock('@bx/shared', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@bx/shared')>();

  return {
    ...actual,
    useCreateCommonCodeGroup: () => mutation,
    useDeleteCommonCodeGroup: () => mutation,
    useFetchCommonCodeGroup: () => ({ data: undefined }),
    useFetchCommonCodeList: () => ({ data: undefined }),
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
});
