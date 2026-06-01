import type { UseMutationOptions, UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { QueryHookOptions } from '@/shared/types';

import {
  createAlarmMutation,
  deleteAlarmMutation,
  fetchAlarmQuery,
  fetchAlarmListQuery,
} from './alarm.queries';
import type { Alarm, AlarmsQueryParams } from './alarm.type';

/**
 * 모든 알람 목록을 가져오는 쿼리 훅.
 * @param params - 알람 목록 조회 쿼리 파라미터.
 * @param options - 추가 쿼리 옵션.
 */
export const useFetchAlarmList = <T extends Alarm = Alarm>(
  params?: AlarmsQueryParams,
  options?: QueryHookOptions<Array<T>>,
): UseQueryResult<Array<T>, Error> => {
  return useQuery({ ...options, ...fetchAlarmListQuery<T>(params) });
};

/**
 * 특정 알람의 알람 정보를 가져오는 쿼리 훅.
 * @param alarmId - 조회할 알람 ID.
 */
export const useFetchAlarm = <T extends Alarm = Alarm>(
  alarmId: number,
  options?: QueryHookOptions<T>,
): UseQueryResult<T, Error> => {
  return useQuery({ ...options, ...fetchAlarmQuery<T>(alarmId) });
};

/**
 * 새로운 알람를 생성하는 뮤테이션 훅.
 * @param [options] - 추가 뮤테이션 설정 옵션.
 */
export const useCreateAlarm = (
  options?: UseMutationOptions<Alarm, Error, Alarm, unknown>,
): UseMutationResult<Alarm, Error, Alarm, unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    ...createAlarmMutation(),
    ...options,
    onSuccess: async (data, variables, context, mutation) => {
      await queryClient.invalidateQueries({ queryKey: ['alarm'] });
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context, mutation);
      }
    },
  });
};

/**
 * 기존 알람를 삭제하는 뮤테이션 훅.
 * @param [options] - 추가 뮤테이션 설정 옵션.
 */
export const useDeleteAlarm = (
  options?: UseMutationOptions<void, Error, number, unknown>,
): UseMutationResult<void, Error, number, unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    ...deleteAlarmMutation(),
    ...options,
    onSuccess: async (data, variables, context, mutation) => {
      await queryClient.invalidateQueries({ queryKey: ['alarm'] });
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context, mutation);
      }
    },
  });
};
