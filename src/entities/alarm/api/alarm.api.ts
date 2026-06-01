import { API_URL } from '@/shared/constants';
import { httpService } from '@/shared/lib/ajax/http.service';

import type { Alarm, AlarmsQueryParams } from '../model/alarm.type';

/**
 * 알람 목록을 조회합니다.
 * @param [params] - 조회 파라미터 (선택 사항).
 * @returns 알람 목록 응답 Promise.
 */
export const fetchAlarmList = <T extends Alarm = Alarm>(
  params?: AlarmsQueryParams,
): Promise<Array<T>> =>
  httpService.get<Array<T>>(`${API_URL}/alarms`, params);

/**
 * 특정 ID의 알람을 조회합니다.
 * @param id - 조회할 알람 ID.
 * @returns 알람 상세 정보 Promise.
 */
export const fetchAlarm = <T extends Alarm = Alarm>(id: number): Promise<T> =>
  httpService.get<T>(`${API_URL}/alarms/${id}`);

/**
 * 새로운 알람을 생성합니다.
 * @param payload - 생성할 알람 정보.
 * @returns 생성된 알람 정보 Promise.
 */
export const createAlarm = (payload: Alarm): Promise<Alarm> =>
  httpService.post<Alarm>(`${API_URL}/alarms`, payload);

/**
 * 알람을 삭제합니다.
 * @param id - 삭제할 알람 ID.
 * @returns 삭제 완료 Promise.
 */
export const deleteAlarm = (id: number): Promise<void> =>
  httpService.delete<void>(`${API_URL}/alarms/${id}`);
