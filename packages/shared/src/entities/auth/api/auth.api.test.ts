import axios from 'axios';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { httpService } from '../../../shared/ajax/http.service';
import { API_CONFIG } from '../../../shared/constants';
import { useGlobalLoadingStore } from '../../../shared/model/loading/loading.store';

import { login, refreshTokenApi } from './auth.api';

describe('auth api', () => {
  beforeEach(() => {
    useGlobalLoadingStore.setState({ pendingCount: 0 });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('wraps login credentials in the OpenAPI ApiRequest data envelope', async () => {
    const loginResponse = {
      usrId: 'user',
      accessToken: 'access',
      accessTokenExpiresAt: '20991231235959',
    };
    const postSpy = vi.spyOn(httpService, 'post').mockResolvedValue(loginResponse);

    const result = await login({ usrId: 'user', usrPwd: 'hashed-password' });

    expect(postSpy).toHaveBeenCalledWith('/auth/login', {
      data: { usrId: 'user', usrPwd: 'hashed-password' },
    });
    expect(result).toEqual(loginResponse);
  });

  it('uses cookie credentials and no request body for refresh requests', async () => {
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
        },
      },
    });

    await refreshTokenApi();

    expect(postSpy).toHaveBeenCalledWith(
      expect.stringContaining('/auth/refresh-token'),
      undefined,
      expect.objectContaining({ timeout: API_CONFIG.TIMEOUT, withCredentials: true }),
    );
  });

  it('tracks raw refresh requests in the global loading state', async () => {
    let completeRequest: (() => void) | undefined;
    vi.spyOn(axios, 'post').mockImplementation(
      () =>
        new Promise((resolve) => {
          completeRequest = () =>
            resolve({
              data: {
                success: true,
                payload: {
                  usrId: 'user',
                  accessToken: 'access',
                  accessTokenExpiresAt: '20991231235959',
                },
              },
            });
        }),
    );

    const request = refreshTokenApi();

    expect(useGlobalLoadingStore.getState().pendingCount).toBe(1);

    completeRequest?.();
    await request;

    expect(useGlobalLoadingStore.getState().pendingCount).toBe(0);
  });
});
