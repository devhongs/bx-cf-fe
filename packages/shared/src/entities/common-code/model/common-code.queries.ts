import { queryOptions } from '@tanstack/react-query';

import type { HttpLoadingOptions } from '../../../shared/ajax/http.service';

import {
  createCommonCode,
  createCommonCodeGroup,
  deleteCommonCode,
  deleteCommonCodeGroup,
  fetchCommonCodeGroup,
  fetchCommonCodeGroups,
  replaceCommonCodes,
  updateCommonCode,
  updateCommonCodeGroup,
} from '../api/common-code.api';
import type {
  CommonCodeGroupPayload,
  CommonCodeGroupQueryParams,
  CommonCodePayload,
  CommonCodeReplacePayload,
} from './common-code.type';

export const commonCodeQueryKeys = {
  all: ['common-code'] as const,
  groupLists: () => [...commonCodeQueryKeys.all, 'groups', 'list'] as const,
  groupList: (params?: CommonCodeGroupQueryParams) =>
    [...commonCodeQueryKeys.groupLists(), params] as const,
  groupDetail: (groupCd: string) => ['common-code', 'groups', 'detail', groupCd] as const,
};

export const commonCodeGroupListQuery = (
  params?: CommonCodeGroupQueryParams,
  options?: HttpLoadingOptions,
) =>
  queryOptions({
    queryKey: commonCodeQueryKeys.groupList(params),
    queryFn: () => fetchCommonCodeGroups(params, options),
  });

export const commonCodeGroupDetailQuery = (groupCd: string, options?: HttpLoadingOptions) =>
  queryOptions({
    queryKey: commonCodeQueryKeys.groupDetail(groupCd),
    queryFn: () => fetchCommonCodeGroup(groupCd, options),
    staleTime: 0,
  });

export const createCommonCodeGroupMutation = () => ({
  mutationFn: (payload: CommonCodeGroupPayload) => createCommonCodeGroup(payload),
});

export const updateCommonCodeGroupMutation = () => ({
  mutationFn: ({ groupCd, payload }: { groupCd: string; payload: CommonCodeGroupPayload }) =>
    updateCommonCodeGroup(groupCd, payload),
});

export const replaceCommonCodesMutation = () => ({
  mutationFn: ({ groupCd, payload }: { groupCd: string; payload: CommonCodeReplacePayload }) =>
    replaceCommonCodes(groupCd, payload),
});

export const deleteCommonCodeGroupMutation = () => ({
  mutationFn: (groupCd: string) => deleteCommonCodeGroup(groupCd),
});

export const createCommonCodeMutation = () => ({
  mutationFn: ({ groupCd, payload }: { groupCd: string; payload: CommonCodePayload }) =>
    createCommonCode(groupCd, payload),
});

export const updateCommonCodeMutation = () => ({
  mutationFn: ({
    groupCd,
    code,
    payload,
  }: {
    groupCd: string;
    code: string;
    payload: CommonCodePayload;
  }) => updateCommonCode(groupCd, code, payload),
});

export const deleteCommonCodeMutation = () => ({
  mutationFn: ({ groupCd, code }: { groupCd: string; code: string }) =>
    deleteCommonCode(groupCd, code),
});
