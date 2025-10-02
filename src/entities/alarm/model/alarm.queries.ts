import type { ApiListResponse, ApiResponse } from '@/shared/api/types'
import type { UseQueryOptions } from '@tanstack/react-query'
import AlarmService from '../api/alarm.api'
import type { Alarm, AlarmsQueryParams } from './alarm.type'

export const queryKeys = {
  fetchList: ['accounts'] as const,
  fetch: (id: number) => ['account', id] as const,
}

export const queryOptions = {
  // 알람 목록 조회
  fetchList: <T = Alarm>(
    params?: AlarmsQueryParams,
  ): UseQueryOptions<ApiListResponse<T>> => ({
    queryKey: queryKeys.fetchList,
    queryFn: async (): Promise<ApiListResponse<T>> =>
      AlarmService.fetchAll(params),
  }),
  // 알람 상세 조회
  fetch: <T = Alarm>(alarmId: number): UseQueryOptions<ApiResponse<T>> => ({
    queryKey: queryKeys.fetch(alarmId),
    queryFn: () => AlarmService.fetch(alarmId),
  }),
}

export const mutateOptions = {
  // 알람 생성
  create: () => ({
    mutationFn: (payload: Alarm) => AlarmService.create(payload),
  }),
  // 알람 삭제
  delete: () => ({
    mutationFn: (id: number) => AlarmService.delete(id),
  }),
}
