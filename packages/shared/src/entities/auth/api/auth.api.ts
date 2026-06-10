import { httpService } from '../../../shared/ajax/http.service';

import type { Auth } from '../model/auth.type';

export const login = <T extends Auth = Auth>(id: string): Promise<T> =>
  httpService.get<T>(`/users/${id}`);

export const logout = <T extends Auth = Auth>(id: string): Promise<T> =>
  httpService.get<T>(`/logout/${id}`);

export const checkAccessToken = <T extends Auth = Auth>(id: string): Promise<T> =>
  httpService.get<T>(`/check-access-token/${id}`);

export const checkRefreshToken = <T extends Auth = Auth>(id: string): Promise<T> =>
  httpService.get<T>(`/check-refresh-token/${id}`);
