// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { LogoutButton } from './LogoutButton';

const navigate = vi.fn();
const localLogout = vi.fn();
const serverLogout = vi.fn();

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => navigate,
}));

vi.mock('@bx/shared', () => ({
  useAuthStore: () => localLogout,
  useLogout: () => ({ mutate: serverLogout, isPending: false }),
}));

describe('PC LogoutButton', () => {
  beforeEach(() => {
    navigate.mockClear();
    localLogout.mockClear();
    serverLogout.mockClear();
  });

  it('requests server logout when clicked', () => {
    render(<LogoutButton />);

    fireEvent.click(screen.getByRole('button', { name: '로그아웃' }));

    expect(serverLogout).toHaveBeenCalledTimes(1);
  });
});
