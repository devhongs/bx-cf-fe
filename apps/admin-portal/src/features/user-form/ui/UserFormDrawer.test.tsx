// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { UserFormDrawer } from './UserFormDrawer';

const mutation = {
  isPending: false,
  mutate: vi.fn(),
};

vi.mock('@bx/shared', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@bx/shared')>();

  return {
    ...actual,
    useCreateUser: () => mutation,
    useDeleteUser: () => mutation,
    useUpdateUser: () => mutation,
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

describe('UserFormDrawer', () => {
  it('uses the selected list row as form values without fetching detail data', () => {
    render(
      <UserFormDrawer
        open
        user={{
          usrId: 'admin',
          usrNm: '관리자',
          userType: 'ADMIN',
          useYn: 'Y',
          deptName: 'IT',
        }}
        onClose={vi.fn()}
      />,
    );

    expect((screen.getByLabelText(/아이디/) as HTMLInputElement).value).toBe('admin');
    expect((screen.getByLabelText(/이름/) as HTMLInputElement).value).toBe('관리자');
    expect((screen.getByLabelText(/부서/) as HTMLInputElement).value).toBe('IT');
  });
});
