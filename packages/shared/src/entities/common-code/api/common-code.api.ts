import { httpService } from '../../../shared/ajax/http.service';

import type {
  CommonCode,
  CommonCodeGroup,
  CommonCodeGroupListApiRequest,
  CommonCodeGroupPayload,
  CommonCodeGroupQueryParams,
  CommonCodePayload,
} from '../model/common-code.type';

const compact = <T extends Record<string, unknown>>(value: T): Partial<T> | undefined => {
  const entries = Object.entries(value).filter(([, item]) => item !== undefined);
  if (entries.length === 0) return undefined;
  return Object.fromEntries(entries) as Partial<T>;
};

const toGroupListApiRequest = (
  params?: CommonCodeGroupQueryParams,
): CommonCodeGroupListApiRequest | undefined => {
  if (!params) return undefined;

  const { page, size, offset, keyword, searchType, useYn, sort, ...data } = params;
  const request = compact({
    pagination: compact({ page, size, offset }),
    filter: compact({ keyword, searchType, useYn }),
    sort: compact({ sort }),
    data: compact(data),
  });

  return request as CommonCodeGroupListApiRequest | undefined;
};

export const fetchCommonCodeGroups = (
  params?: CommonCodeGroupQueryParams,
): Promise<Array<CommonCodeGroup>> =>
  httpService.post<Array<CommonCodeGroup>>(
    '/system/common-codes/groups/list',
    toGroupListApiRequest(params),
  );

export const fetchCommonCodeGroup = (groupCd: string): Promise<Array<CommonCodeGroup>> =>
  httpService.post<Array<CommonCodeGroup>>('/system/common-codes/groups/detail', {
    data: { groupCd },
  });

export const createCommonCodeGroup = (payload: CommonCodeGroupPayload): Promise<void> =>
  httpService.post<void>('/system/common-codes/groups/create', { data: payload });

export const updateCommonCodeGroup = (
  groupCd: string,
  payload: CommonCodeGroupPayload,
): Promise<void> =>
  httpService.post<void>(
    `/system/common-codes/groups/${encodeURIComponent(groupCd)}/update`,
    { data: payload },
  );

export const deleteCommonCodeGroup = (groupCd: string): Promise<void> =>
  httpService.delete<void>(`/system/common-codes/groups/${encodeURIComponent(groupCd)}`);

export const fetchCommonCodes = (groupCd: string): Promise<Array<CommonCode>> =>
  httpService.post<Array<CommonCode>>(
    `/system/common-codes/groups/${encodeURIComponent(groupCd)}/codes/list`,
  );

export const createCommonCode = (
  groupCd: string,
  payload: CommonCodePayload,
): Promise<void> =>
  httpService.post<void>(
    `/system/common-codes/groups/${encodeURIComponent(groupCd)}/codes/create`,
    { data: payload },
  );

export const updateCommonCode = (
  groupCd: string,
  code: string,
  payload: CommonCodePayload,
): Promise<void> =>
  httpService.post<void>(
    `/system/common-codes/groups/${encodeURIComponent(groupCd)}/codes/${encodeURIComponent(code)}/update`,
    { data: payload },
  );

export const deleteCommonCode = (groupCd: string, code: string): Promise<void> =>
  httpService.delete<void>(
    `/system/common-codes/groups/${encodeURIComponent(groupCd)}/codes/${encodeURIComponent(code)}`,
  );
