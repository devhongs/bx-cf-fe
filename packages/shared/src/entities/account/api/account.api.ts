import { httpService } from '../../../shared/ajax/http.service';
import { API_ENDPOINTS } from '../../../shared/constants';

import type { Account, AccountsQueryParams } from '../model/account.type';

const EP = API_ENDPOINTS.ACCOUNT;

export const fetchAccountList = <T extends Account = Account>(
  params?: AccountsQueryParams,
): Promise<Array<T>> =>
  httpService.get<Array<T>>(EP.LIST, params);

export const fetchAccount = <T extends Account = Account>(accountNo: string): Promise<T> =>
  httpService.get<T>(EP.DETAIL(accountNo));

export const fetchRecentAccountList = <T extends Account = Account>(
  params?: AccountsQueryParams,
): Promise<Array<T>> =>
  httpService.get<Array<T>>(EP.RECENT_LIST, params);

export const createAccount = (payload: Account): Promise<Account> =>
  httpService.post<Account>(EP.LIST, payload);

export const updateAccount = (payload: Account): Promise<Account> =>
  httpService.put<Account>(EP.DETAIL(payload.accountNo), payload);

export const updateAccountFavorite = (id: string, isFavorite: boolean): Promise<Account> =>
  httpService.patch<Account>(EP.DETAIL(id), { isFavorite });

export const deleteAccount = (id: string): Promise<void> =>
  httpService.delete<void>(EP.DETAIL(id));
