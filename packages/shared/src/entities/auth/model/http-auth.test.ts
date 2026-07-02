import { beforeEach, describe, expect, it, vi } from 'vitest';

import { refreshTokenApi } from '../api/auth.api';

import { ensureValidAuthSession, getLoginPath } from './http-auth';
import { tokenStorage } from './token-storage';

vi.mock('../api/auth.api', () => ({
  refreshTokenApi: vi.fn(),
}));

describe('http auth config', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.mocked(refreshTokenApi).mockReset();
  });

  it('builds login redirects within the app base path', () => {
    expect(getLoginPath('/')).toBe('/login');
    expect(getLoginPath('/pc/')).toBe('/pc/login');
    expect(getLoginPath('/mobile')).toBe('/mobile/login');
  });

  it('keeps the route session when access token is still valid', async () => {
    tokenStorage.set({
      accessToken: 'access-token',
      accessTokenExpiresAt: '20991231235959',
    });

    await expect(ensureValidAuthSession()).resolves.toBe(true);
    expect(refreshTokenApi).not.toHaveBeenCalled();
  });

  it('refreshes before route entry when access token is expired', async () => {
    tokenStorage.set({
      accessToken: 'expired-access-token',
      accessTokenExpiresAt: '20240101000000',
    });
    vi.mocked(refreshTokenApi).mockResolvedValue({
      usrId: 'user',
      usrNm: 'User',
      positDivName: 'Manager',
      deptName: 'Channel',
      roles: [],
      accessToken: 'new-access-token',
      accessTokenExpiresAt: '20991231235959',
    });

    await expect(ensureValidAuthSession()).resolves.toBe(true);
    expect(refreshTokenApi).toHaveBeenCalledTimes(1);
    expect(tokenStorage.getAccessToken()).toBe('new-access-token');
  });

  it('rejects route entry when access token is expired and refresh fails', async () => {
    tokenStorage.set({
      accessToken: 'expired-access-token',
      accessTokenExpiresAt: '20240101000000',
    });
    vi.mocked(refreshTokenApi).mockRejectedValue(new Error('missing refresh cookie'));

    await expect(ensureValidAuthSession()).resolves.toBe(false);
    expect(refreshTokenApi).toHaveBeenCalledTimes(1);
  });
});
