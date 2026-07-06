import { describe, expect, it } from 'vitest';

import { $formatUtils } from './common.format';

describe('format utils', () => {
  it('formats yyyymmdd date strings with the existing default token style', () => {
    expect($formatUtils.dateFormat('20240131')).toBe('2024-01-31');
  });

  it('keeps the existing year/day token style compatible', () => {
    expect($formatUtils.dateFormat('2024-01-31', 'yyyyMMdd')).toBe('20240131');
    expect($formatUtils.dateFormat('2024-01-31', 'yyyy.MM.dd')).toBe('2024.01.31');
  });

  it('formats compact date time strings through date and time helpers', () => {
    expect($formatUtils.dateTimeFormat('20240131093045')).toBe('2024-01-31 09:30:45');
  });
});
