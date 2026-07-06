import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { NavSidebar } from './NavSidebar';

const navigate = vi.fn();

vi.mock('@tanstack/react-router', () => ({
  useLocation: () => ({ pathname: '/main', search: {} }),
  useNavigate: () => navigate,
}));

vi.mock('@/shared/context/LayoutContext', () => ({
  useLayout: () => ({ navSidebarOpen: true }),
}));

vi.mock('./AccountMenu', () => ({
  AccountMenu: () => <div data-testid="account-menu" />,
}));

describe('NavSidebar', () => {
  beforeEach(() => {
    navigate.mockClear();
  });

  it('navigates playground menu items to separated pages', () => {
    render(<NavSidebar />);

    fireEvent.click(screen.getByRole('button', { name: 'Form' }));
    fireEvent.click(screen.getByRole('button', { name: 'Components' }));

    expect(navigate).toHaveBeenNthCalledWith(1, expect.objectContaining({ to: '/form' }));
    expect(navigate).toHaveBeenNthCalledWith(2, expect.objectContaining({ to: '/components' }));
  });
});
