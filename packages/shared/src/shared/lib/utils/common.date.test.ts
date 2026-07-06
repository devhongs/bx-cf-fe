import { describe, expect, it } from 'vitest';

import { $dateUtils } from './common.date';

describe('date utils', () => {
  it('validates yyyymmdd dates strictly while allowing delimiters', () => {
    expect($dateUtils.isValidDate('20240229')).toBe(true);
    expect($dateUtils.isValidDate('2024-02-29')).toBe(true);
    expect($dateUtils.isValidDate('20240230')).toBe(false);
  });

  it('calculates dates from yyyymmdd strings', () => {
    expect($dateUtils.addDay(1, '20240131')).toBe('20240201');
    expect($dateUtils.addMonth(1, '20240131')).toBe('20240229');
    expect($dateUtils.addYear(1, '20240229')).toBe('20250228');
  });
});
