// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { MenuFormDrawer } from './MenuFormDrawer';

const mutationState = vi.hoisted(() => ({
  createPending: false,
  updatePending: false,
  deletePending: true,
}));

vi.mock('@bx/shared', () => ({
  useAuthStore: (selector: (state: { user: { usrId: string } }) => unknown) =>
    selector({ user: { usrId: 'admin' } }),
  useFetchMenu: () => ({ data: undefined }),
  useCreateMenu: () => ({ isPending: mutationState.createPending, mutateAsync: vi.fn() }),
  useUpdateMenu: () => ({ isPending: mutationState.updatePending, mutateAsync: vi.fn() }),
  useDeleteMenu: () => ({ isPending: mutationState.deletePending, mutateAsync: vi.fn() }),
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
  MenuForm: ({ id }: { id: string }) => <form id={id} />,
}));

afterEach(cleanup);

describe('MenuFormDrawer', () => {
  it('shows the common processing label while any mutation is pending', () => {
    render(<MenuFormDrawer open menuId={1} onClose={vi.fn()} />);

    expect((screen.getByRole('button', { name: '삭제 중' }) as HTMLButtonElement).disabled).toBe(
      true,
    );
    expect((screen.getByRole('button', { name: '처리 중' }) as HTMLButtonElement).disabled).toBe(
      true,
    );
  });
});
