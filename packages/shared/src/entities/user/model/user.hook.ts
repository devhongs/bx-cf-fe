import type { UseMutationOptions, UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { splitHttpLoadingOptions } from '../../../shared/ajax/http.service';
import type { QueryHookOptions } from '../../../shared/types';

import {
  createUserMutation,
  deleteUserMutation,
  updateUserMutation,
  userDetailQuery,
  userListQuery,
  userQueryKeys,
} from './user.queries';
import type { ManagedUser, UserPayload, UserQueryParams } from './user.type';

export const useFetchUserList = (
  params?: UserQueryParams,
  options?: QueryHookOptions<Array<ManagedUser>>,
): UseQueryResult<Array<ManagedUser>, Error> => {
  const { loadingOptions, remainingOptions } = splitHttpLoadingOptions(options);
  return useQuery({ ...remainingOptions, ...userListQuery(params, loadingOptions) });
};

export const useFetchUser = (
  usrId: string,
  options?: QueryHookOptions<ManagedUser>,
): UseQueryResult<ManagedUser, Error> => {
  const { loadingOptions, remainingOptions } = splitHttpLoadingOptions(options);
  return useQuery({ ...remainingOptions, ...userDetailQuery(usrId, loadingOptions) });
};

export const useCreateUser = (
  options?: UseMutationOptions<void, Error, UserPayload, unknown>,
): UseMutationResult<void, Error, UserPayload, unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    ...createUserMutation(),
    ...options,
    onSuccess: async (data, variables, onMutateResult, context) => {
      await queryClient.invalidateQueries({ queryKey: userQueryKeys.all });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};

export const useUpdateUser = (
  options?: UseMutationOptions<
    void,
    Error,
    { usrId: string; payload: Partial<UserPayload> },
    unknown
  >,
): UseMutationResult<void, Error, { usrId: string; payload: Partial<UserPayload> }, unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    ...updateUserMutation(),
    ...options,
    onSuccess: async (data, variables, onMutateResult, context) => {
      await queryClient.invalidateQueries({ queryKey: userQueryKeys.all });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};

export const useDeleteUser = (
  options?: UseMutationOptions<void, Error, string, unknown>,
): UseMutationResult<void, Error, string, unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    ...deleteUserMutation(),
    ...options,
    onSuccess: async (data, variables, onMutateResult, context) => {
      await queryClient.invalidateQueries({ queryKey: userQueryKeys.all });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
