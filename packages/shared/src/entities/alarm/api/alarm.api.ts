import { type HttpLoadingOptions, httpService } from '../../../shared/ajax/http.service';

import type { Alarm, AlarmsQueryParams } from '../model/alarm.type';

export const fetchAlarmList = <T extends Alarm = Alarm>(
  params?: AlarmsQueryParams,
  options?: HttpLoadingOptions,
): Promise<Array<T>> =>
  options
    ? httpService.get<Array<T>>('/alarms', params, options)
    : httpService.get<Array<T>>('/alarms', params);

export const fetchAlarm = <T extends Alarm = Alarm>(
  id: number,
  options?: HttpLoadingOptions,
): Promise<T> =>
  options
    ? httpService.get<T>(`/alarms/${id}`, undefined, options)
    : httpService.get<T>(`/alarms/${id}`);

export const createAlarm = (payload: Alarm): Promise<Alarm> =>
  httpService.post<Alarm>('/alarms', payload);

export const deleteAlarm = (id: number): Promise<void> => httpService.delete<void>(`/alarms/${id}`);
