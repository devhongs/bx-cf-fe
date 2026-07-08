import { httpService } from '../../../shared/ajax/http.service';

import type {
  ManagedUser,
  UserListApiRequest,
  UserPayload,
  UserQueryParams,
} from '../model/user.type';

const compact = <T extends Record<string, unknown>>(value: T): Partial<T> | undefined => {
  const entries = Object.entries(value).filter(([, item]) => item !== undefined);
  if (entries.length === 0) return undefined;
  return Object.fromEntries(entries) as Partial<T>;
};

const toUserListApiRequest = (params?: UserQueryParams): UserListApiRequest | undefined => {
  if (!params) return undefined;

  const { page, size, offset, keyword, searchType, sort, useYn, ...data } = params;
  const request = compact({
    pagination: compact({ page, size, offset }),
    filter: compact({ keyword, searchType, useYn }),
    sort: compact({ sort }),
    data: compact(data),
  });

  return request as UserListApiRequest | undefined;
};

export const fetchUserList = (params?: UserQueryParams): Promise<Array<ManagedUser>> =>
  httpService.post<Array<ManagedUser>>('/users/list', toUserListApiRequest(params));

export const fetchUser = (usrId: string): Promise<ManagedUser> =>
  httpService.post<ManagedUser>(`/users/detail/${encodeURIComponent(usrId)}`);

export const createUser = (payload: UserPayload): Promise<void> =>
  httpService.post<void>('/users/create', { data: payload });

export const updateUser = (usrId: string, payload: Partial<UserPayload>): Promise<void> =>
  httpService.post<void>(`/users/${encodeURIComponent(usrId)}/update`, { data: payload });

export const deleteUser = (usrId: string): Promise<void> =>
  httpService.delete<void>(`/users/${encodeURIComponent(usrId)}`);
