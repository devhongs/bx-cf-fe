import { describe, expect, it } from 'vitest';

import { getLoginPath } from './http-auth';

describe('http auth config', () => {
  it('builds login redirects within the app base path', () => {
    expect(getLoginPath('/')).toBe('/login');
    expect(getLoginPath('/pc/')).toBe('/pc/login');
    expect(getLoginPath('/mobile')).toBe('/mobile/login');
  });
});
