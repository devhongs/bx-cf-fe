import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  routeOptions: undefined as { beforeLoad: (args: unknown) => Promise<unknown> } | undefined,
  requireAuth: vi.fn(),
  ensureBaseInfoBootstrapped: vi.fn(),
  createBaseInfoMenuCacheScope: vi.fn((app: string, userId: string) => `${app}:${userId}`),
  getAuthState: vi.fn(),
  queryClient: {},
}));

vi.mock('@tanstack/react-router', () => ({
  Outlet: () => null,
  createFileRoute: () => (options: { beforeLoad: (args: unknown) => Promise<unknown> }) => {
    mocks.routeOptions = options;
    return {};
  },
}));

vi.mock('@bx/shared', () => ({
  createBaseInfoMenuCacheScope: mocks.createBaseInfoMenuCacheScope,
  ensureBaseInfoBootstrapped: mocks.ensureBaseInfoBootstrapped,
  useAuthStore: { getState: mocks.getAuthState },
}));
vi.mock('@/queryClient', () => ({ queryClient: mocks.queryClient }));
vi.mock('@/shared/guards/requireAuth', () => ({ requireAuth: mocks.requireAuth }));
vi.mock('@/widgets/layout/sidebar', () => ({ AdminSidebar: () => null }));

import './_page';

describe('Admin protected page loader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getAuthState.mockReturnValue({ user: { usrId: 'admin' } });
  });

  it('authenticates before bootstrapping base info with an app-specific menu scope', async () => {
    const args = { location: { href: '/dashboard' }, context: {} };
    const context = { state: { from: 'login' } };
    mocks.requireAuth.mockResolvedValue(context);

    const result = await mocks.routeOptions?.beforeLoad(args);

    expect(mocks.createBaseInfoMenuCacheScope).toHaveBeenCalledWith('admin', 'admin');
    expect(mocks.ensureBaseInfoBootstrapped).toHaveBeenCalledWith(mocks.queryClient, {
      menuCacheScope: 'admin:admin',
    });
    expect(mocks.requireAuth.mock.invocationCallOrder[0]).toBeLessThan(
      mocks.ensureBaseInfoBootstrapped.mock.invocationCallOrder[0],
    );
    expect(result).toBe(context);
  });
});
