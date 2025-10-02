import type { ApiListResponse } from '@/shared/api/types'
import { API_URL } from '@/shared/constants'
import { httpService } from '@/shared/lib/ajax/http.service'
import { mockToApiListResponse } from '@/shared/lib/utils'
import type { Alarm, AlarmsQueryParams } from '../model/alarm.type'

/**
 * 알람 관련 API 요청을 처리하는 서비스 클래스.
 */
export default class AlarmService {
  /**
   * 알람 목록을 조회합니다.
   * @param [params] - 조회 파라미터 (선택 사항).
   * @returns 알람 목록 페이지네이션 응답 Promise.
   */
  static async fetchAll<T = Alarm>(
    params?: AlarmsQueryParams,
  ): Promise<ApiListResponse<T>> {
    const res = await fetch(`http://localhost:3333/alarms`) // GET
    const data = await res.json()
    return mockToApiListResponse(data)
    // return httpService.get<ApiResponse<T>>(`${API_URL}/accounts`, params)
  }

  /**
   * 특정 No의 알람을 조회합니다.
   * @param accountNo - 조회할 알람 No.
   * @returns 알람 상세 정보 Promise.
   */
  static async fetch<T = Alarm>(accountNo: number): Promise<T> {
    return httpService.get<T>(`${API_URL}/account/${accountNo}`)
  }

  /**
   * 새로운 알람을 생성합니다.
   * @param payload - 생성할 알람 정보.
   * @returns 생성된 알람 정보 Promise.
   */
  static async create(payload: Alarm): Promise<Alarm> {
    return httpService.post<Alarm>(`${API_URL}/account`, payload)
  }

  /**
   * 알람 삭제합니다.
   * @param id - 삭제할 알람 ID.
   * @returns 삭제 결과 Promise. (any 대신 실제 응답 타입 명시 권장)
   */
  static delete(id: number): Promise<any> {
    return httpService.delete<any>(`${API_URL}/alarm/${id}`)
  }
}
