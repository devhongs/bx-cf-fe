import { describe, expect, it } from 'vitest';

import { HttpService } from './http.service';

const getInterceptorCount = (service: HttpService, type: 'request' | 'response') => {
  const client = (service as any).httpClient;
  return client.interceptors[type].handlers.filter(Boolean).length;
};

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
});
