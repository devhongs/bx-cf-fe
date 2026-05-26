import { queryOptions } from '@tanstack/react-query';

import {
  createAlarm,
  deleteAlarm,
  fetchAlarm,
  fetchAlarms,
} from '../api/alarm.api';
import type { Alarm, AlarmsQueryParams } from './alarm.type';

export const queryKeys = {
  fetchList: (params?: AlarmsQueryParams) => ['alarms', params] as const,
  fetch: (id: number) => ['alarm', id] as const,
};

// 개별 Named Export와 v5 queryOptions 헬퍼 적용
export const fetchAlarmsQuery = <T = Alarm>(params?: AlarmsQueryParams) =>
  queryOptions({
    queryKey: queryKeys.fetchList(params),
    queryFn: () => fetchAlarms<T>(params),
  });

export const fetchAlarmQuery = <T = Alarm>(alarmId: number) =>
  queryOptions({
    queryKey: queryKeys.fetch(alarmId),
    queryFn: () => fetchAlarm<T>(alarmId),
  });

// 개별 Named Export 뮤테이션 옵션
export const createAlarmMutation = () => ({
  mutationFn: (payload: Alarm) => createAlarm(payload),
});

export const deleteAlarmMutation = () => ({
  mutationFn: (id: number) => deleteAlarm(id),
});
