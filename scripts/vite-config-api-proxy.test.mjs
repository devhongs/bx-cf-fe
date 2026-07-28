import { describe, expect, it } from 'vitest';

const configs = [
  ['pc', await import('../apps/pc-web/vite.config.ts')],
  ['admin', await import('../apps/admin-portal/vite.config.ts')],
  ['mobile', await import('../apps/mobile-web/vite.config.ts')],
];

const resolveConfig = async (module, mode) =>
  module.default({
    command: 'serve',
    mode,
    isSsrBuild: false,
    isPreview: false,
  });

describe('app Vite API proxies', () => {
  it.each(configs)('%s uses the remote proxy target', async (_name, module) => {
    const config = await resolveConfig(module, 'remote');
    expect(config.server.proxy['/channel'].target).toBe('http://192.168.110.217');
  });

  it.each(configs)('%s uses the local Nest proxy target', async (_name, module) => {
    const config = await resolveConfig(module, 'nest');
    expect(config.server.proxy['/channel'].target).toBe('http://127.0.0.1:18081');
  });
});
