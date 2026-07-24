import { queryOptions } from '@tanstack/react-query';

import type { HttpLoadingOptions } from '../../../shared/ajax/http.service';

import { createUser, deleteUser, fetchUser, fetchUserList, updateUser } from '../api/user.api';
import type { UserPayload, UserQueryParams } from './user.type';

export const userQueryKeys = {
  all: ['user'] as const,
  list: (params?: UserQueryParams) => ['user', 'list', params] as const,
  detail: (usrId: string) => ['user', 'detail', usrId] as const,
};

export const userListQuery = (params?: UserQueryParams, options?: HttpLoadingOptions) =>
  queryOptions({
    queryKey: userQueryKeys.list(params),
    queryFn: () => fetchUserList(params, options),
  });

export const userDetailQuery = (usrId: string, options?: HttpLoadingOptions) =>
  queryOptions({
    queryKey: userQueryKeys.detail(usrId),
    queryFn: () => fetchUser(usrId, options),
  });

export const createUserMutation = () => ({
  mutationFn: (payload: UserPayload) => createUser(payload),
});

export const updateUserMutation = () => ({
  mutationFn: ({ usrId, payload }: { usrId: string; payload: Partial<UserPayload> }) =>
    updateUser(usrId, payload),
});

export const deleteUserMutation = () => ({
  mutationFn: (usrId: string) => deleteUser(usrId),
});
