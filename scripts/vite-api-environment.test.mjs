import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import {
  DEFAULT_API_PROXY_TARGET,
  formatApiEnvironmentLog,
  loadApiEnvironment,
} from './vite-api-environment.mjs';

const rootDir = resolve(fileURLToPath(new URL('..', import.meta.url)));
const appDirs = ['apps/pc-web', 'apps/admin-portal', 'apps/mobile-web'].map((path) =>
  resolve(rootDir, path),
);

describe('vite API environment', () => {
  it.each(appDirs)('loads remote mode for %s', (envDir) => {
    expect(loadApiEnvironment({ mode: 'remote', envDir })).toEqual({
      mode: 'remote',
      apiUrl: '/channel/backend/api/v1',
      proxyTarget: 'http://192.168.110.217',
    });
  });

  it.each(appDirs)('loads spring mode for %s', (envDir) => {
    expect(loadApiEnvironment({ mode: 'spring', envDir })).toEqual({
      mode: 'spring',
      apiUrl: '/channel/backend/api/v1',
      proxyTarget: 'http://127.0.0.1:18081',
    });
  });

  it.each(appDirs)('loads mock mode for %s', (envDir) => {
    expect(loadApiEnvironment({ mode: 'mock', envDir })).toEqual({
      mode: 'mock',
      apiUrl: 'http://127.0.0.1:3333',
      proxyTarget: DEFAULT_API_PROXY_TARGET,
    });
  });

  it('formats a startup diagnostic without hiding the selected target', () => {
    expect(
      formatApiEnvironmentLog({
        mode: 'spring',
        apiUrl: '/channel/backend/api/v1',
        proxyTarget: 'http://127.0.0.1:18081',
      }),
    ).toBe(
      '[vite-api] mode=spring apiUrl=/channel/backend/api/v1 proxyTarget=http://127.0.0.1:18081',
    );
  });
});
