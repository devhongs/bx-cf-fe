// @vitest-environment jsdom

import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AdminSidebar } from './AdminSidebar';

const navigate = vi.fn();

vi.mock('@tanstack/react-router', () => ({
  useLocation: () => ({ pathname: '/dashboard' }),
  useNavigate: () => navigate,
}));

describe('AdminSidebar', () => {
  beforeEach(() => {
    navigate.mockClear();
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
});
