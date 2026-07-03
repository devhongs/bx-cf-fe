import { httpService } from '../../../shared/ajax/http.service';

import type { Account, AccountsQueryParams } from '../model/account.type';

export const fetchAccountList = <T extends Account = Account>(
  params?: AccountsQueryParams,
): Promise<Array<T>> => httpService.get<Array<T>>('/accounts', params);

export const fetchAccount = <T extends Account = Account>(accountNo: string): Promise<T> =>
  httpService.get<T>(`/accounts/${accountNo}`);

export const fetchRecentAccountList = <T extends Account = Account>(
  params?: AccountsQueryParams,
): Promise<Array<T>> => httpService.get<Array<T>>('/recentAccounts', params);

export const createAccount = (payload: Account): Promise<Account> =>
  httpService.post<Account>('/accounts', payload);

export const updateAccount = (payload: Account): Promise<Account> =>
  httpService.put<Account>(`/accounts/${payload.accountNo}`, payload);

export const updateAccountFavorite = (id: string, isFavorite: boolean): Promise<Account> =>
  httpService.patch<Account>(`/accounts/${id}`, { isFavorite });

export const deleteAccount = (id: string): Promise<void> =>
  httpService.delete<void>(`/accounts/${id}`);
