import { API_URL } from '../../../shared/constants';
import { httpService } from '../../../shared/ajax/http.service';

import type { Account, AccountsQueryParams } from '../model/account.type';

/**
 * 계좌 목록을 조회합니다.
 * @param [params] - 조회 파라미터 (선택 사항).
 * @returns 계좌 목록 응답 Promise.
 */
export const fetchAccountList = <T extends Account = Account>(
  params?: AccountsQueryParams,
): Promise<Array<T>> =>
  httpService.get<Array<T>>(`${API_URL}/accounts`, params);

/**
 * 특정 No의 계좌를 조회합니다.
 * @param accountNo - 조회할 계좌 No.
 * @returns 계좌 상세 정보 Promise.
 */
export const fetchAccount = <T extends Account = Account>(accountNo: string): Promise<T> =>
  httpService.get<T>(`${API_URL}/accounts/${accountNo}`);

/**
 * 최근 사용한 계좌 목록을 조회합니다.
 * @param [params] - 조회 파라미터 (선택 사항).
 * @returns 계좌 목록 응답 Promise.
 */
export const fetchRecentAccountList = <T extends Account = Account>(
  params?: AccountsQueryParams,
): Promise<Array<T>> =>
  httpService.get<Array<T>>(`${API_URL}/recentAccounts`, params);

/**
 * 새로운 계좌를 생성합니다.
 * @param payload - 생성할 계좌 정보.
 * @returns 생성된 계좌 정보 Promise.
 */
export const createAccount = (payload: Account): Promise<Account> =>
  httpService.post<Account>(`${API_URL}/accounts`, payload);

/**
 * 기존 계좌 정보를 수정합니다.
 * @param payload - 수정할 계좌 정보 (ID 포함 필수).
 * @returns 수정된 계좌 정보 Promise.
 */
export const updateAccount = (payload: Account): Promise<Account> =>
  httpService.put<Account>(`${API_URL}/accounts/${payload.accountNo}`, payload);

/**
 * 특정 계좌의 즐겨찾기 상태를 업데이트합니다. (순수 단일 API)
 * @param id - 계좌 고유 ID (string)
 * @param isFavorite - 즐겨찾기 지정 여부
 * @returns 업데이트된 계좌 정보 Promise.
 */
export const updateAccountFavorite = (id: string, isFavorite: boolean): Promise<Account> =>
  httpService.patch<Account>(`${API_URL}/accounts/${id}`, {
    isFavorite,
  });

/**
 * 계좌를 삭제합니다.
 * @param id - 삭제할 계좌 ID.
 * @returns 삭제 완료 Promise.
 */
export const deleteAccount = (id: string): Promise<void> =>
  httpService.delete<void>(`${API_URL}/accounts/${id}`);
