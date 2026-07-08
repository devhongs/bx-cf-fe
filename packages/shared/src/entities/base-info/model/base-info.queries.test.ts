import { describe, expect, it } from 'vitest';

import { baseInfoBootstrapQuery, baseInfoQueryKeys } from './base-info.queries';

describe('base info query keys', () => {
  it('uses the entity query key object pattern for bootstrap keys', () => {
    expect(baseInfoQueryKeys.all).toEqual(['base-info']);
    expect(baseInfoQueryKeys.bootstrap('hongsik.yoo')).toEqual([
      'base-info',
      'bootstrap',
      'hongsik.yoo',
    ]);
  });

  it('creates bootstrap query options from the query key object pattern', () => {
    expect(baseInfoBootstrapQuery({ menuCacheScope: 'hongsik.yoo' })).toMatchObject({
      queryKey: ['base-info', 'bootstrap', 'hongsik.yoo'],
      staleTime: Number.POSITIVE_INFINITY,
      gcTime: Number.POSITIVE_INFINITY,
    });
  });
});
