import type { InternalAxiosRequestConfig } from 'axios';
import { beforeEach, describe, expect, it } from 'vitest';

import { useGlobalLoadingStore } from '../model/loading/loading.store';
import { HttpService } from './http.service';

const getInterceptorCount = (service: HttpService, type: 'request' | 'response') => {
  const client = (service as any).httpClient;
  return client.interceptors[type].handlers.filter(Boolean).length;
};

beforeEach(() => {
  useGlobalLoadingStore.setState({ pendingCount: 0 });
});

describe('HttpService auth interceptor setup', () => {
  it('does not accumulate auth interceptors when initialized more than once', () => {
    const service = new HttpService();
    const auth = {
      getAccessToken: () => null,
      refreshToken: async () => null,
      onAuthFail: () => undefined,
    };

    service.init({ auth });
    service.init({ auth });

    expect(getInterceptorCount(service, 'request')).toBe(1);
    expect(getInterceptorCount(service, 'response')).toBe(1);
  });

  it('enables credentials on the shared axios client', () => {
    const service = new HttpService();

    service.init();

    expect((service as any).httpClient.defaults.withCredentials).toBe(true);
  });

  it('sends an empty object body for post requests without payload', async () => {
    const service = new HttpService();
    let capturedConfig: InternalAxiosRequestConfig | undefined;

    (service as any).httpClient.defaults.adapter = async (config: InternalAxiosRequestConfig) => {
      capturedConfig = config;
      return {
        config,
        data: { success: true, code: '0', msg: 'success', payload: null },
        headers: {},
        status: 200,
        statusText: 'OK',
      };
    };

    await service.post('/product/list');

    expect(JSON.parse(String(capturedConfig?.data))).toEqual({});
  });

  it('tracks server requests for the global loading overlay by default', async () => {
    const service = new HttpService();
    let completeRequest: (() => void) | undefined;

    (service as any).httpClient.defaults.adapter = (config: InternalAxiosRequestConfig) =>
      new Promise((resolve) => {
        completeRequest = () =>
          resolve({
            config,
            data: { success: true, code: '0', msg: 'success', payload: null },
            headers: {},
            status: 200,
            statusText: 'OK',
          });
      });

    const request = service.get('/product/list');

    expect(useGlobalLoadingStore.getState().pendingCount).toBe(1);

    completeRequest?.();
    await request;

    expect(useGlobalLoadingStore.getState().pendingCount).toBe(0);
  });

  it('skips global loading when showSpinner is false', async () => {
    const service = new HttpService();
    let capturedConfig: InternalAxiosRequestConfig | undefined;
    let completeRequest: (() => void) | undefined;

    (service as any).httpClient.defaults.adapter = (config: InternalAxiosRequestConfig) =>
      new Promise((resolve) => {
        capturedConfig = config;
        completeRequest = () =>
          resolve({
            config,
            data: { success: true, code: '0', msg: 'success', payload: null },
            headers: {},
            status: 200,
            statusText: 'OK',
          });
      });

    const request = service.get('/background/status', undefined, { showSpinner: false });

    expect(useGlobalLoadingStore.getState().pendingCount).toBe(0);

    completeRequest?.();
    await request;

    expect((capturedConfig as any)?.showSpinner).toBeUndefined();
  });

  it('does not attach access tokens to login requests', async () => {
    const service = new HttpService();
    let capturedConfig: InternalAxiosRequestConfig | undefined;

    service.init({
      auth: {
        getAccessToken: () => 'stale-access-token',
        refreshToken: async () => null,
        onAuthFail: () => undefined,
      },
    });
    (service as any).httpClient.defaults.adapter = async (config: InternalAxiosRequestConfig) => {
      capturedConfig = config;
      return {
        config,
        data: { success: true, code: '0', msg: 'success', payload: null },
        headers: {},
        status: 200,
        statusText: 'OK',
      };
    };

    await service.post('/auth/login', { usrId: 'user', usrPwd: 'password' });

    expect(capturedConfig?.headers.Authorization).toBeUndefined();
  });

  it('attaches access tokens to logout requests', async () => {
    const service = new HttpService();
    let capturedConfig: InternalAxiosRequestConfig | undefined;

    service.init({
      auth: {
        getAccessToken: () => 'access-token',
        refreshToken: async () => null,
        onAuthFail: () => undefined,
      },
    });
    (service as any).httpClient.defaults.adapter = async (config: InternalAxiosRequestConfig) => {
      capturedConfig = config;
      return {
        config,
        data: { success: true, code: '0', msg: 'success', payload: null },
        headers: {},
        status: 200,
        statusText: 'OK',
      };
    };

    await service.post('/auth/logout');

    expect(capturedConfig?.headers.Authorization).toBe('Bearer access-token');
  });
});
