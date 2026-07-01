import { beforeEach, describe, expect, it } from 'vitest';

import { STORAGE_KEYS } from '../../../shared/constants';

import {
  hasValidAccessSession,
  isExpired,
  tokenStorage,
} from './token-storage';

describe('token expiration checks', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('treats malformed expiration values as expired', () => {
    expect(isExpired('not-a-date', 0)).toBe(true);
    expect(isExpired('202401', 0)).toBe(true);
  });

  it('does not persist refresh token values in web storage', () => {
    tokenStorage.set({
      accessToken: 'access-token',
      accessTokenExpiresAt: '20991231235959',
    });

    expect(localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)).toBeNull();
    expect(tokenStorage.get()).toEqual({
      accessToken: 'access-token',
      accessTokenExpiresAt: '20991231235959',
    });
  });

  it('normalizes manually double-quoted token storage values', () => {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, '""access-token""');
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN_EXPIRES_AT, '""20991231235959""');

    expect(tokenStorage.getAccessToken()).toBe('access-token');
    expect(tokenStorage.getAccessTokenExpiresAt()).toBe('20991231235959');
  });

  it('reports a valid access session when access token metadata is alive', () => {
    tokenStorage.set({
      accessToken: 'access-token',
      accessTokenExpiresAt: '20991231235959',
    });

    expect(hasValidAccessSession()).toBe(true);
  });

  it('reports an invalid access session when access token metadata is expired', () => {
    tokenStorage.set({
      accessToken: 'access-token',
      accessTokenExpiresAt: '20240101000000',
    });

    expect(hasValidAccessSession()).toBe(false);
  });

  it('reports an invalid access session when access token is missing', () => {
    tokenStorage.set({
      accessToken: 'access-token',
      accessTokenExpiresAt: '20991231235959',
    });
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);

    expect(hasValidAccessSession()).toBe(false);
  });
});
