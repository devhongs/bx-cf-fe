import { describe, expect, it } from 'vitest';

import { userListQuery, userQueryKeys } from './user.queries';

describe('user query keys', () => {
  it('uses the entity query key object pattern', () => {
    expect(userQueryKeys.all).toEqual(['user']);
    expect(userQueryKeys.list({ userType: 'ADMIN' })).toEqual([
      'user',
      'list',
      { userType: 'ADMIN' },
    ]);
    expect(userQueryKeys.detail('admin')).toEqual(['user', 'detail', 'admin']);
  });

  it('creates list query options from the key object pattern', () => {
    expect(userListQuery({ keyword: '관리자' })).toMatchObject({
      queryKey: ['user', 'list', { keyword: '관리자' }],
    });
  });
});
