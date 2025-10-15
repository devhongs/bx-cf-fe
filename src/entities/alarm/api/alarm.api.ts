import type { ApiListResponse, ApiResponse } from '@/shared/api/types'
import { API_URL } from '@/shared/constants'
import HttpJsonService from '@/shared/lib/ajax/http.json.service'

import type { Alarm, AlarmsQueryParams } from '../model/alarm.type'

/**
 * 알람 관련 API 요청을 처리하는 서비스 클래스.
 */
export default class AlarmService {
  /**
   * 알람 목록을 조회합니다.
   * @param [params] - 조회 파라미터 (선택 사항). ㄴ
   * @returns 알람 목록 페이지네이션 응답 Promise.
   */
  static async fetchAll<T = Alarm>(
    params?: AlarmsQueryParams,
  ): Promise<ApiListResponse<T>> {
    // return httpService.get<ApiResponse<T>>(`${API_URL}/alarms`, params)
    return HttpJsonService.fetchAll<T>(`${API_URL}/alarms`, params)
  }

  /**
   * 특정 No의 알람을 조회합니다.
   * @param accountNo - 조회할 알람 No.
   * @returns 알람 상세 정보 Promise.
   */
  static async fetch<T = Alarm>(id: number): Promise<ApiResponse<T>> {
    // return httpService.get<T>(`${API_URL}/alarm/${accountNo}`)
    return HttpJsonService.fetch<T>(`${API_URL}/alarms/?id=${id}`)
  }

  /**
   * 새로운 알람을 생성합니다.
   * @param payload - 생성할 알람 정보.
   * @returns 생성된 알람 정보 Promise.
   */
  static async create(payload: Alarm): Promise<Alarm> {
    // return httpService.post<Alarm>(`${API_URL}/alarm`, payload)
    return HttpJsonService.post<any>(`${API_URL}/alarms/${payload.id}`, payload)
  }

  /**
   * 알람 삭제합니다.
   * @param id - 삭제할 알람 ID.
   * @returns 삭제 결과 Promise. (any 대신 실제 응답 타입 명시 권장)
   */
  static delete(id: number): Promise<any> {
    // return HttpJsonService.delete<T>(`${API_URL}/alarms/${id}`)
    return HttpJsonService.delete<any>(`${API_URL}/alarms/${id}?_dependent=id`)
  }
}
