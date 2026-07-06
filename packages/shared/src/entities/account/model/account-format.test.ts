import { describe, expect, it } from 'vitest';

import { formatAccountNumberByBank } from './account-format';

describe('account format', () => {
  it('formats account numbers inside the account domain', () => {
    expect(formatAccountNumberByBank('KB', '123456789012')).toBe('123-456-789012');
  });

  it('returns an empty string when the account number has no digits', () => {
    expect(formatAccountNumberByBank('KB', '---')).toBe('');
  });
});
