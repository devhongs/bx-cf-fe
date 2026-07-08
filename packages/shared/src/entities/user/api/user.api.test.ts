import { afterEach, describe, expect, it, vi } from 'vitest';

import { httpService } from '../../../shared/ajax/http.service';

import { createUser, deleteUser, fetchUser, fetchUserList, updateUser } from './user.api';

describe('user api', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches users from the planned shared user endpoint', async () => {
    const users = [{ usrId: 'admin', usrNm: '관리자', userType: 'ADMIN' }];
    const postSpy = vi.spyOn(httpService, 'post').mockResolvedValue(users);

    const result = await fetchUserList({ userType: 'ADMIN' });

    expect(postSpy).toHaveBeenCalledWith('/users/list', {
      data: { userType: 'ADMIN' },
    });
    expect(result).toEqual(users);
  });

  it('fetches a user detail from the planned shared user endpoint', async () => {
    const user = { usrId: 'admin', usrNm: '관리자', userType: 'ADMIN' };
    const postSpy = vi.spyOn(httpService, 'post').mockResolvedValue(user);

    const result = await fetchUser('admin');

    expect(postSpy).toHaveBeenCalledWith('/users/detail/admin');
    expect(result).toEqual(user);
  });

  it('creates and updates users through the planned shared user endpoint', async () => {
    const payload = { usrId: 'admin', usrNm: '관리자', userType: 'ADMIN' as const };
    const postSpy = vi.spyOn(httpService, 'post').mockResolvedValue({});

    await createUser(payload);
    await updateUser('admin', payload);

    expect(postSpy).toHaveBeenNthCalledWith(1, '/users/create', { data: payload });
    expect(postSpy).toHaveBeenNthCalledWith(2, '/users/admin/update', { data: payload });
  });

  it('deletes users through the planned shared user delete endpoint', async () => {
    const deleteSpy = vi.spyOn(httpService, 'delete').mockResolvedValue(undefined);

    await deleteUser('admin');

    expect(deleteSpy).toHaveBeenCalledWith('/users/admin');
  });
});
