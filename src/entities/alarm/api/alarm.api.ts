import type { ApiListResponse, ApiResponse } from '@/shared/api/types';
import { API_URL } from '@/shared/constants';
import { HttpJsonService } from '@/shared/lib/ajax/http.json.service';

import type { Alarm, AlarmsQueryParams } from '../model/alarm.type';

/**
 * 알람 목록을 조회합니다.
 * @param [params] - 조회 파라미터 (선택 사항).
 * @returns 알람 목록 페이지네이션 응답 Promise.
 */
export const fetchAlarms = async <T = Alarm>(
  params?: AlarmsQueryParams,
): Promise<ApiListResponse<T>> => {
  return HttpJsonService.fetchAll<T>(`${API_URL}/alarms`, params);
};

/**
 * 특정 ID의 알람을 조회합니다.
 * @param id - 조회할 알람 ID.
 * @returns 알람 상세 정보 Promise.
 */
export const fetchAlarm = async <T = Alarm>(id: number): Promise<ApiResponse<T>> => {
  return HttpJsonService.fetch<T>(`${API_URL}/alarms/?id=${id}`);
};

/**
 * 새로운 알람을 생성합니다.
 * @param payload - 생성할 알람 정보.
 * @returns 생성된 알람 정보 Promise.
 */
export const createAlarm = async (payload: Alarm): Promise<Alarm> => {
  return HttpJsonService.post<any>(`${API_URL}/alarms/${payload.id}`, payload);
};

/**
 * 알람을 삭제합니다.
 * @param id - 삭제할 알람 ID.
 * @returns 삭제 완료 Promise.
 */
export const deleteAlarm = async (id: number): Promise<any> => {
  return HttpJsonService.delete<any>(`${API_URL}/alarms/${id}?_dependent=id`);
};
