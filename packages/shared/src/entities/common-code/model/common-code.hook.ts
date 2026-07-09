import type { UseMutationOptions, UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { QueryHookOptions } from '../../../shared/types';

import {
  commonCodeGroupDetailQuery,
  commonCodeGroupListQuery,
  commonCodeListQuery,
  commonCodeQueryKeys,
  createCommonCodeGroupMutation,
  createCommonCodeMutation,
  deleteCommonCodeGroupMutation,
  deleteCommonCodeMutation,
  updateCommonCodeGroupMutation,
  updateCommonCodeMutation,
} from './common-code.queries';
import type {
  CommonCode,
  CommonCodeGroup,
  CommonCodeGroupPayload,
  CommonCodeGroupQueryParams,
  CommonCodePayload,
  CommonCodeQueryParams,
} from './common-code.type';

export const useFetchCommonCodeGroupList = (
  params?: CommonCodeGroupQueryParams,
  options?: QueryHookOptions<Array<CommonCodeGroup>>,
): UseQueryResult<Array<CommonCodeGroup>, Error> => {
  return useQuery({ ...options, ...commonCodeGroupListQuery(params) });
};

export const useFetchCommonCodeGroup = (
  groupCd: string,
  options?: QueryHookOptions<Array<CommonCodeGroup>>,
): UseQueryResult<Array<CommonCodeGroup>, Error> => {
  return useQuery({ ...options, ...commonCodeGroupDetailQuery(groupCd) });
};

export const useFetchCommonCodeList = (
  groupCd: string,
  params?: CommonCodeQueryParams,
  options?: QueryHookOptions<Array<CommonCode>>,
): UseQueryResult<Array<CommonCode>, Error> => {
  return useQuery({ ...options, ...commonCodeListQuery(groupCd, params) });
};

export const useCreateCommonCodeGroup = (
  options?: UseMutationOptions<void, Error, CommonCodeGroupPayload, unknown>,
): UseMutationResult<void, Error, CommonCodeGroupPayload, unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    ...createCommonCodeGroupMutation(),
    ...options,
    onSuccess: async (data, variables, onMutateResult, context) => {
      await queryClient.invalidateQueries({ queryKey: commonCodeQueryKeys.all });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};

export const useUpdateCommonCodeGroup = (
  options?: UseMutationOptions<
    void,
    Error,
    { groupCd: string; payload: CommonCodeGroupPayload },
    unknown
  >,
): UseMutationResult<
  void,
  Error,
  { groupCd: string; payload: CommonCodeGroupPayload },
  unknown
> => {
  const queryClient = useQueryClient();
  return useMutation({
    ...updateCommonCodeGroupMutation(),
    ...options,
    onSuccess: async (data, variables, onMutateResult, context) => {
      await queryClient.invalidateQueries({ queryKey: commonCodeQueryKeys.all });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};

export const useDeleteCommonCodeGroup = (
  options?: UseMutationOptions<void, Error, string, unknown>,
): UseMutationResult<void, Error, string, unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    ...deleteCommonCodeGroupMutation(),
    ...options,
    onSuccess: async (data, variables, onMutateResult, context) => {
      await queryClient.invalidateQueries({ queryKey: commonCodeQueryKeys.all });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};

export const useCreateCommonCode = (
  options?: UseMutationOptions<
    void,
    Error,
    { groupCd: string; payload: CommonCodePayload },
    unknown
  >,
): UseMutationResult<void, Error, { groupCd: string; payload: CommonCodePayload }, unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    ...createCommonCodeMutation(),
    ...options,
    onSuccess: async (data, variables, onMutateResult, context) => {
      await queryClient.invalidateQueries({ queryKey: commonCodeQueryKeys.all });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};

export const useUpdateCommonCode = (
  options?: UseMutationOptions<
    void,
    Error,
    { groupCd: string; code: string; payload: CommonCodePayload },
    unknown
  >,
): UseMutationResult<
  void,
  Error,
  { groupCd: string; code: string; payload: CommonCodePayload },
  unknown
> => {
  const queryClient = useQueryClient();
  return useMutation({
    ...updateCommonCodeMutation(),
    ...options,
    onSuccess: async (data, variables, onMutateResult, context) => {
      await queryClient.invalidateQueries({ queryKey: commonCodeQueryKeys.all });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};

export const useDeleteCommonCode = (
  options?: UseMutationOptions<void, Error, { groupCd: string; code: string }, unknown>,
): UseMutationResult<void, Error, { groupCd: string; code: string }, unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    ...deleteCommonCodeMutation(),
    ...options,
    onSuccess: async (data, variables, onMutateResult, context) => {
      await queryClient.invalidateQueries({ queryKey: commonCodeQueryKeys.all });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
