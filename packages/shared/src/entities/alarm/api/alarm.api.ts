import { httpService } from '../../../shared/ajax/http.service';
import { API_ENDPOINTS } from '../../../shared/constants';

import type { Alarm, AlarmsQueryParams } from '../model/alarm.type';

const EP = API_ENDPOINTS.ALARM;

export const fetchAlarmList = <T extends Alarm = Alarm>(
  params?: AlarmsQueryParams,
): Promise<Array<T>> =>
  httpService.get<Array<T>>(EP.LIST, params);

export const fetchAlarm = <T extends Alarm = Alarm>(id: number): Promise<T> =>
  httpService.get<T>(EP.DETAIL(id));

export const createAlarm = (payload: Alarm): Promise<Alarm> =>
  httpService.post<Alarm>(EP.LIST, payload);

export const deleteAlarm = (id: number): Promise<void> =>
  httpService.delete<void>(EP.DETAIL(id));
