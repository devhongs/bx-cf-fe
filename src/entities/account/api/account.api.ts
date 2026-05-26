import type { ApiListResponse, ApiResponse } from '@/shared/api/types';
import { API_URL } from '@/shared/constants';
import { HttpJsonService } from '@/shared/lib/ajax/http.json.service';
import { httpService } from '@/shared/lib/ajax/http.service';

import type { Account, AccountsQueryParams } from '../model/account.type';

/**
 * 계좌 관련 API 요청을 처리하는 서비스 클래스.
 */
export class AccountService {
  /**
   * 계좌 목록을 조회합니다.
   * @param [params] - 조회 파라미터 (선택 사항).
   * @returns 계좌 목록 페이지네이션 응답 Promise.
   */
  static async fetchAll<T = Account>(
    params?: AccountsQueryParams,
  ): Promise<ApiListResponse<T>> {
    // return httpService.get<ApiResponse<T>>(`${API_URL}/accounts`, params)
    return HttpJsonService.fetchAll<T>(`${API_URL}/accounts`, params);
  }

  /**
   * 특정 No의 계좌을 조회합니다.
   * @param accountNo - 조회할 계좌 No.
   * @returns 계좌 상세 정보 Promise.
   */
  static async fetch<T = Account>(accountNo: string): Promise<ApiResponse<T>> {
    // return httpService.get<T>(`${API_URL}/accounts/${accountNo}`)
    return HttpJsonService.fetch<T>(`${API_URL}/accounts/${accountNo}`);
  }

  static async fetchRecent<T = Account>(
    params?: AccountsQueryParams,
  ): Promise<ApiListResponse<T>> {
    return HttpJsonService.fetchRecent<T>(`${API_URL}/recentAccounts`, params);
  }

  /**
   * 새로운 계좌을 생성합니다.
   * @param payload - 생성할 계좌 정보.
   * @returns 생성된 계좌 정보 Promise.
   */
  static async create(payload: Account): Promise<Account> {
    return httpService.post<Account>(`${API_URL}/accounts`, payload);
  }

  static async setFavorite(accountNo: string): Promise<void> {
    // 1) 전체 목록 조회
    const list = await HttpJsonService.fetchAll<Account>(`${API_URL}/accounts`);
    const items = list.content;

    // 2) 이미 true인 것들 false로
    const toFalse = items.filter(
      (a) => a.isFavorite && a.accountNo !== accountNo,
    );
    await Promise.all(
      toFalse.map((acc) =>
        HttpJsonService.patch<Account>(`${API_URL}/accounts/${acc.id}`, {
          isFavorite: false,
        }),
      ),
    );

    // 3) 타깃 true로
    const target = items.find((a) => a.accountNo === accountNo);
    if (!target) throw new Error('Account not found');
    await HttpJsonService.patch<Account>(`${API_URL}/accounts/${target.id}`, {
      isFavorite: true,
    });
  }

  /**
   * 기존 계좌을 수정합니다.
   * @param payload - 수정할 계좌 정보 (ID 포함 필수).
   * @returns 수정된 계좌 정보 Promise.
   */
  static update(payload: Account): Promise<Account> {
    // return httpService.put<Account>(
    //   `${API_URL}/account/${payload.accountNo}`,
    //   payload,
    // )
    return HttpJsonService.put<Account>(
      `${API_URL}/accounts/${payload.accountNo}`,
      payload,
    );
  }

  /**
   * 계좌 삭제합니다.
   * @param id - 삭제할 계좌 ID.
   * @returns 삭제 결과 Promise. (any 대신 실제 응답 타입 명시 권장)
   */
  static delete(id: number): Promise<any> {
    return httpService.delete<any>(`${API_URL}/accounts/${id}`);
  }
}
