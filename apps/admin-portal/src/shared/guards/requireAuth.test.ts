import { beforeEach, describe, expect, it, vi } from 'vitest';

import { requireAuth } from './requireAuth';

const mocks = vi.hoisted(() => ({
  ensureValidAuthSession: vi.fn(),
  getAuthState: vi.fn(),
  redirect: vi.fn(),
}));

vi.mock('@bx/shared', () => ({
  ensureValidAuthSession: mocks.ensureValidAuthSession,
  useAuthStore: { getState: mocks.getAuthState },
}));

vi.mock('@tanstack/react-router', () => ({
  redirect: mocks.redirect,
}));

describe('requireAuth', () => {
  beforeEach(() => {
    mocks.ensureValidAuthSession.mockReset();
    mocks.getAuthState.mockReset();
    mocks.redirect.mockReset();
  });

  it('redirects to login when the authenticated user id is missing', async () => {
    const redirectResult = new Error('redirect');
    mocks.ensureValidAuthSession.mockResolvedValue(true);
    mocks.getAuthState.mockReturnValue({ user: null });
    mocks.redirect.mockReturnValue(redirectResult);

    await expect(requireAuth({ location: { href: '/menus' }, context: {} })).rejects.toBe(
      redirectResult,
    );
    expect(mocks.redirect).toHaveBeenCalledWith({
      to: '/login',
      search: { redirect: '/menus' },
    });
  });

  it('allows route entry when the session and authenticated user id are valid', async () => {
    mocks.ensureValidAuthSession.mockResolvedValue(true);
    mocks.getAuthState.mockReturnValue({ user: { usrId: 'admin' } });

    await expect(
      requireAuth({ location: { href: '/menus', state: { from: 'login' } }, context: {} }),
    ).resolves.toEqual({ state: { from: 'login' } });
    expect(mocks.redirect).not.toHaveBeenCalled();
  });
});
