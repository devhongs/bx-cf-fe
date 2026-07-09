import { httpService } from '../../../shared/ajax/http.service';

import type {
  CommonCode,
  CommonCodeGroup,
  CommonCodeGroupPayload,
  CommonCodeGroupQueryParams,
  CommonCodePayload,
} from '../model/common-code.type';

export const fetchCommonCodeGroups = (
  _params?: CommonCodeGroupQueryParams,
): Promise<Array<CommonCodeGroup>> =>
  httpService.post<Array<CommonCodeGroup>>('/system/common-codes/groups/list');

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
  httpService.post<void>(`/system/common-codes/groups/${encodeURIComponent(groupCd)}/update`, {
    data: payload,
  });

export const deleteCommonCodeGroup = (groupCd: string): Promise<void> =>
  httpService.delete<void>(`/system/common-codes/groups/${encodeURIComponent(groupCd)}`);

export const fetchCommonCodes = (groupCd: string): Promise<Array<CommonCode>> =>
  httpService.post<Array<CommonCode>>(
    `/system/common-codes/groups/${encodeURIComponent(groupCd)}/codes/list`,
  );

export const createCommonCode = (groupCd: string, payload: CommonCodePayload): Promise<void> =>
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
