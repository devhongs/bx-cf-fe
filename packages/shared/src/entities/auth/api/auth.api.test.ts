import axios from 'axios';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { API_CONFIG } from '../../../shared/constants';

import { refreshTokenApi } from './auth.api';

describe('auth api', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('uses the shared API timeout for refresh requests', async () => {
    const postSpy = vi.spyOn(axios, 'post').mockResolvedValue({
      data: {
        success: true,
        payload: {
          usrId: 'user',
          usrNm: 'User',
          positDivName: 'Manager',
          deptName: 'Channel',
          roles: [],
          accessToken: 'access',
          accessTokenExpiresAt: '20991231235959',
          refreshToken: 'refresh',
          refreshTokenExpiresAt: '20991231235959',
          usrPwd: null,
        },
      },
    });

    await refreshTokenApi('refresh-token');

    expect(postSpy).toHaveBeenCalledWith(
      expect.stringContaining('/auth/refresh-token'),
      { refreshToken: 'refresh-token' },
      expect.objectContaining({ timeout: API_CONFIG.TIMEOUT }),
    );
  });
});
