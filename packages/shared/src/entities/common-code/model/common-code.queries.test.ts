import { describe, expect, it } from 'vitest';

import { commonCodeGroupListQuery, commonCodeQueryKeys } from './common-code.queries';

describe('common code query keys', () => {
  it('uses the entity query key object pattern', () => {
    expect(commonCodeQueryKeys.all).toEqual(['common-code']);
    expect(commonCodeQueryKeys.groupLists()).toEqual(['common-code', 'groups', 'list']);
    expect(commonCodeQueryKeys.groupList({ useYn: 'Y' })).toEqual([
      'common-code',
      'groups',
      'list',
      { useYn: 'Y' },
    ]);
    expect(commonCodeQueryKeys.groupDetail('USE_YN')).toEqual([
      'common-code',
      'groups',
      'detail',
      'USE_YN',
    ]);
  });

  it('creates group list query options from the key object pattern', () => {
    expect(commonCodeGroupListQuery({ keyword: '사용' })).toMatchObject({
      queryKey: ['common-code', 'groups', 'list', { keyword: '사용' }],
    });
  });
});
