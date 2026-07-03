import { httpService } from '../../../shared/ajax/http.service';

import type { Alarm, AlarmsQueryParams } from '../model/alarm.type';

export const fetchAlarmList = <T extends Alarm = Alarm>(
  params?: AlarmsQueryParams,
): Promise<Array<T>> => httpService.get<Array<T>>('/alarms', params);

export const fetchAlarm = <T extends Alarm = Alarm>(id: number): Promise<T> =>
  httpService.get<T>(`/alarms/${id}`);

export const createAlarm = (payload: Alarm): Promise<Alarm> =>
  httpService.post<Alarm>('/alarms', payload);

export const deleteAlarm = (id: number): Promise<void> => httpService.delete<void>(`/alarms/${id}`);
