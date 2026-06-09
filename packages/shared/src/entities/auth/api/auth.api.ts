import { httpService } from '../../../shared/ajax/http.service';
import { API_ENDPOINTS } from '../../../shared/constants';

import type { Auth } from '../model/auth.type';

export const login = <T extends Auth = Auth>(id: string): Promise<T> =>
  httpService.get<T>(`${API_ENDPOINTS.AUTH.LOGIN}/${id}`);

export const logout = <T extends Auth = Auth>(id: string): Promise<T> =>
  httpService.get<T>(`${API_ENDPOINTS.AUTH.LOGOUT}/${id}`);

export const checkAccessToken = <T extends Auth = Auth>(id: string): Promise<T> =>
  httpService.get<T>(`${API_ENDPOINTS.AUTH.CHECK_ACCESS_TOKEN}/${id}`);

export const checkRefreshToken = <T extends Auth = Auth>(id: string): Promise<T> =>
  httpService.get<T>(`${API_ENDPOINTS.AUTH.CHECK_REFRESH_TOKEN}/${id}`);
