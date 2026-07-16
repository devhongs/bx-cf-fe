import { describe, expect, it } from 'vitest';

import { menuListQuery, menuQueryKeys } from './menu.queries';

describe('menu query keys', () => {
  it('uses the entity query key object pattern', () => {
    expect(menuQueryKeys.all).toEqual(['menu']);
    expect(menuQueryKeys.lists()).toEqual(['menu', 'list']);
    expect(menuQueryKeys.list({ useYn: 'Y' })).toEqual(['menu', 'list', { useYn: 'Y' }]);
    expect(menuQueryKeys.detail(1)).toEqual(['menu', 'detail', 1]);
  });

  it('creates list query options from the key object pattern', () => {
    expect(menuListQuery({ keyword: '대시보드' })).toMatchObject({
      queryKey: ['menu', 'list', { keyword: '대시보드' }],
    });
  });
});
