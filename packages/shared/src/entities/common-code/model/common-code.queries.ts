import { queryOptions } from '@tanstack/react-query';

import {
  createCommonCode,
  createCommonCodeGroup,
  deleteCommonCode,
  deleteCommonCodeGroup,
  fetchCommonCodeGroup,
  fetchCommonCodeGroups,
  fetchCommonCodes,
  updateCommonCode,
  updateCommonCodeGroup,
} from '../api/common-code.api';
import type {
  CommonCodeGroupPayload,
  CommonCodeGroupQueryParams,
  CommonCodePayload,
  CommonCodeQueryParams,
} from './common-code.type';

export const commonCodeQueryKeys = {
  all: ['common-code'] as const,
  groupList: (params?: CommonCodeGroupQueryParams) =>
    ['common-code', 'groups', 'list', params] as const,
  groupDetail: (groupCd: string) => ['common-code', 'groups', 'detail', groupCd] as const,
  codeList: (groupCd: string, params?: CommonCodeQueryParams) =>
    ['common-code', 'codes', groupCd, 'list', params] as const,
};

export const commonCodeGroupListQuery = (params?: CommonCodeGroupQueryParams) =>
  queryOptions({
    queryKey: commonCodeQueryKeys.groupList(params),
    queryFn: () => fetchCommonCodeGroups(params),
  });

export const commonCodeGroupDetailQuery = (groupCd: string) =>
  queryOptions({
    queryKey: commonCodeQueryKeys.groupDetail(groupCd),
    queryFn: () => fetchCommonCodeGroup(groupCd),
  });

export const commonCodeListQuery = (groupCd: string, params?: CommonCodeQueryParams) =>
  queryOptions({
    queryKey: commonCodeQueryKeys.codeList(groupCd, params),
    queryFn: () => fetchCommonCodes(groupCd),
  });

export const createCommonCodeGroupMutation = () => ({
  mutationFn: (payload: CommonCodeGroupPayload) => createCommonCodeGroup(payload),
});

export const updateCommonCodeGroupMutation = () => ({
  mutationFn: ({ groupCd, payload }: { groupCd: string; payload: CommonCodeGroupPayload }) =>
    updateCommonCodeGroup(groupCd, payload),
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
