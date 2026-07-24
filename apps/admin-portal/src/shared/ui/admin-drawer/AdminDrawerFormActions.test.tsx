// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { AdminDrawerFormActions } from './AdminDrawerFormActions';

const { openDeleteConfirm } = vi.hoisted(() => ({
  openDeleteConfirm: vi.fn(),
}));

vi.mock('@bx/shared', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@bx/shared')>();

  return {
    ...actual,
    openDeleteConfirm,
  };
});

afterEach(cleanup);

describe('AdminDrawerFormActions', () => {
  beforeEach(() => {
    openDeleteConfirm.mockReset();
  });

  it('삭제 확인을 승인한 경우에만 기능별 삭제 콜백을 실행한다', async () => {
    const onDelete = vi.fn();
    openDeleteConfirm.mockResolvedValueOnce(false).mockResolvedValueOnce(true);

    render(<AdminDrawerFormActions formId="test-form" pending={false} onDelete={onDelete} />);

    fireEvent.click(screen.getByRole('button', { name: '삭제' }));
    await waitFor(() => expect(openDeleteConfirm).toHaveBeenCalledTimes(1));
    expect(onDelete).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: '삭제' }));
    await waitFor(() => expect(onDelete).toHaveBeenCalledOnce());
  });

  it('삭제 콜백이 없으면 저장 액션만 렌더링한다', () => {
    render(<AdminDrawerFormActions formId="test-form" pending={false} />);

    expect(screen.queryByRole('button', { name: '삭제' })).toBeNull();
    expect(screen.getByRole('button', { name: '저장' }).getAttribute('form')).toBe('test-form');
  });

  it('처리 중에는 모든 액션을 비활성화하고 상태 문구를 표시한다', () => {
    render(<AdminDrawerFormActions formId="test-form" pending deletePending onDelete={vi.fn()} />);

    expect((screen.getByRole('button', { name: '삭제 중' }) as HTMLButtonElement).disabled).toBe(
      true,
    );
    const submitButton = screen.getByRole('button', { name: '처리 중' }) as HTMLButtonElement;
    expect(submitButton.disabled).toBe(true);
    expect(submitButton.querySelector('[data-slot="spinner"]')).not.toBeNull();
  });
});
