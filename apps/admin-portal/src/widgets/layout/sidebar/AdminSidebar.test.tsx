// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { AdminSidebar } from './AdminSidebar';

const navigate = vi.fn();

vi.mock('@tanstack/react-router', () => ({
  useLocation: () => ({ pathname: '/dashboard' }),
  useNavigate: () => navigate,
}));

describe('AdminSidebar', () => {
  beforeEach(() => {
    navigate.mockClear();
    window.localStorage.clear();
    document.documentElement.classList.add('dark');
  });

  afterEach(() => {
    cleanup();
    document.documentElement.classList.remove('dark');
  });

  it('navigates the admin core menus', () => {
    render(<AdminSidebar />);

    fireEvent.click(screen.getByRole('button', { name: '코드관리' }));
    fireEvent.click(screen.getByRole('button', { name: '메뉴관리' }));
    fireEvent.click(screen.getByRole('button', { name: '사용자 관리' }));

    expect(navigate).toHaveBeenNthCalledWith(1, expect.objectContaining({ to: '/codes' }));
    expect(navigate).toHaveBeenNthCalledWith(2, expect.objectContaining({ to: '/menus' }));
    expect(navigate).toHaveBeenNthCalledWith(3, expect.objectContaining({ to: '/users' }));
  });

  it('shows theme and logout actions in the profile popover', () => {
    render(<AdminSidebar />);

    expect(screen.getByTitle('프로필')).toBeTruthy();
    expect(screen.queryByRole('button', { name: '로그아웃' })).toBeNull();
    expect(screen.queryByRole('button', { name: '라이트 테마' })).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: '프로필' }));
    expect(screen.getByRole('button', { name: '로그아웃' })).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: '라이트 테마' }));

    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});
