import { describe, expect, it } from 'vitest';

import { isExpired } from './token-storage';

describe('token expiration checks', () => {
  it('treats malformed expiration values as expired', () => {
    expect(isExpired('not-a-date', 0)).toBe(true);
    expect(isExpired('202401', 0)).toBe(true);
  });
});
