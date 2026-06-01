import { queryOptions } from '@tanstack/react-query';

import { createAlarm, deleteAlarm, fetchAlarm, fetchAlarmList } from '../api/alarm.api';
import type { Alarm, AlarmsQueryParams } from './alarm.type';

export const queryKeys = {
  all: ['alarm'] as const,
  list: (params?: AlarmsQueryParams) => ['alarm', 'list', params] as const,
  detail: (id: number) => ['alarm', 'detail', id] as const,
};

// 개별 Named Export와 v5 queryOptions 헬퍼 적용
export const fetchAlarmListQuery = <T extends Alarm = Alarm>(params?: AlarmsQueryParams) =>
  queryOptions({
    queryKey: queryKeys.list(params),
    queryFn: () => fetchAlarmList<T>(params),
  });

export const fetchAlarmQuery = <T extends Alarm = Alarm>(alarmId: number) =>
  queryOptions({
    queryKey: queryKeys.detail(alarmId),
    queryFn: () => fetchAlarm<T>(alarmId),
  });

// 개별 Named Export 뮤테이션 옵션
export const createAlarmMutation = () => ({
  mutationFn: (payload: Alarm) => createAlarm(payload),
});

export const deleteAlarmMutation = () => ({
  mutationFn: (id: number) => deleteAlarm(id),
});
