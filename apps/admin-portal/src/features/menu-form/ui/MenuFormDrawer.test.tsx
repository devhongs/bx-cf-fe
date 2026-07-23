// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { MenuFormDrawer } from './MenuFormDrawer';

const mutationState = vi.hoisted(() => ({
  createPending: false,
  updatePending: false,
  deletePending: false,
}));

const mocks = vi.hoisted(() => ({
  createMenu: vi.fn(),
  updateMenu: vi.fn(),
  deleteMenu: vi.fn(),
  toastSuccess: vi.fn(),
}));

vi.mock('@bx/shared', () => ({
  toast: { success: mocks.toastSuccess },
  useAuthStore: (selector: (state: { user: { usrId: string } }) => unknown) =>
    selector({ user: { usrId: 'admin' } }),
  useFetchMenu: () => ({ data: undefined }),
  useCreateMenu: () => ({ isPending: mutationState.createPending, mutateAsync: mocks.createMenu }),
  useUpdateMenu: () => ({ isPending: mutationState.updatePending, mutateAsync: mocks.updateMenu }),
  useDeleteMenu: () => ({ isPending: mutationState.deletePending, mutateAsync: mocks.deleteMenu }),
}));

vi.mock('@/shared/ui/admin-drawer/AdminDrawer', () => ({
  AdminDrawer: ({ children, footer }: { children: ReactNode; footer: ReactNode }) => (
    <div>
      {children}
      <footer>{footer}</footer>
    </div>
  ),
}));

vi.mock('./MenuForm', () => ({
  MenuForm: ({ id, onSubmit }: { id: string; onSubmit: (payload: unknown) => Promise<void> }) => (
    <form
      id={id}
      onSubmit={(event) => {
        event.preventDefault();
        void onSubmit({ menuCd: 'MENU001', menuNm: '메뉴 관리' });
      }}
    />
  ),
}));

afterEach(cleanup);

describe('MenuFormDrawer', () => {
  beforeEach(() => {
    mutationState.createPending = false;
    mutationState.updatePending = false;
    mutationState.deletePending = false;
    mocks.createMenu.mockReset().mockResolvedValue(undefined);
    mocks.updateMenu.mockReset().mockResolvedValue(undefined);
    mocks.deleteMenu.mockReset().mockResolvedValue(undefined);
    mocks.toastSuccess.mockReset();
  });

  it('shows the common processing label while any mutation is pending', () => {
    mutationState.deletePending = true;

    render(<MenuFormDrawer open menuId={1} onClose={vi.fn()} />);

    expect((screen.getByRole('button', { name: '삭제 중' }) as HTMLButtonElement).disabled).toBe(
      true,
    );
    expect((screen.getByRole('button', { name: '처리 중' }) as HTMLButtonElement).disabled).toBe(
      true,
    );
  });

  it('closes the drawer after saving without toasting directly', async () => {
    const handleClose = vi.fn();

    render(<MenuFormDrawer open menuId={1} onClose={handleClose} />);

    fireEvent.click(screen.getByRole('button', { name: '저장' }));

    await waitFor(() => {
      expect(handleClose).toHaveBeenCalledOnce();
    });
    // 성공 토스트는 이제 공통(MutationCache + meta.success)이 담당한다. 드로어는 직접 띄우지 않는다.
    expect(mocks.toastSuccess).not.toHaveBeenCalled();
  });
});
