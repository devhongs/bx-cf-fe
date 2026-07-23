import { httpService } from '../../../shared/ajax/http.service';

import type {
  CommonCodeGroup,
  CommonCodeGroupPayload,
  CommonCodeGroupQueryParams,
  CommonCodePayload,
  CommonCodeReplacePayload,
} from '../model/common-code.type';

export const fetchCommonCodeGroups = (
  _params?: CommonCodeGroupQueryParams,
): Promise<Array<CommonCodeGroup>> =>
  httpService.post<Array<CommonCodeGroup>>('/system/common-codes/groups/list');

export const fetchCommonCodeGroup = (groupCd: string): Promise<Array<CommonCodeGroup>> =>
  httpService.post<Array<CommonCodeGroup>>(
    `/system/common-codes/${encodeURIComponent(groupCd)}/detail`,
  );

export const createCommonCodeGroup = (payload: CommonCodeGroupPayload): Promise<void> =>
  httpService.post<void>('/system/common-codes/create', {
    data: { ...payload, codes: payload.codes ?? [] },
  });

const toReplacePayload = (
  group: CommonCodeGroup,
  overrides: CommonCodeGroupPayload = {},
  codes: CommonCodePayload[] = group.codes ?? [],
): CommonCodeReplacePayload => ({
  groupNm: overrides.groupNm ?? group.groupNm ?? '',
  groupDesc: overrides.groupDesc ?? group.groupDesc,
  systemYn: overrides.systemYn ?? group.systemYn,
  useYn: overrides.useYn ?? group.useYn,
  sortSeq: overrides.sortSeq,
  codes,
});

const fetchFirstCommonCodeGroup = async (groupCd: string): Promise<CommonCodeGroup> => {
  const groups = await fetchCommonCodeGroup(groupCd);
  return groups[0] ?? { groupCd, groupNm: groupCd, codes: [] };
};

export const updateCommonCodeGroup = (
  groupCd: string,
  payload: CommonCodeGroupPayload,
): Promise<void> =>
  fetchFirstCommonCodeGroup(groupCd).then((group) =>
    replaceCommonCodes(groupCd, toReplacePayload(group, payload)),
  );

export const replaceCommonCodes = (
  groupCd: string,
  payload: CommonCodeReplacePayload,
): Promise<void> =>
  httpService.post<void>(`/system/common-codes/${encodeURIComponent(groupCd)}/replace`, {
    data: payload,
  });

export const deleteCommonCodeGroup = (groupCd: string): Promise<void> =>
  httpService.post<void>(`/system/common-codes/${encodeURIComponent(groupCd)}/delete`);

export const createCommonCode = (groupCd: string, payload: CommonCodePayload): Promise<void> =>
  fetchFirstCommonCodeGroup(groupCd).then((group) =>
    replaceCommonCodes(groupCd, toReplacePayload(group, {}, [...(group.codes ?? []), payload])),
  );

export const updateCommonCode = (
  groupCd: string,
  code: string,
  payload: CommonCodePayload,
): Promise<void> =>
  fetchFirstCommonCodeGroup(groupCd).then((group) =>
    replaceCommonCodes(
      groupCd,
      toReplacePayload(
        group,
        {},
        (group.codes ?? []).map((item) => (item.code === code ? { ...item, ...payload } : item)),
      ),
    ),
  );

export const deleteCommonCode = (groupCd: string, code: string): Promise<void> =>
  fetchFirstCommonCodeGroup(groupCd).then((group) =>
    replaceCommonCodes(
      groupCd,
      toReplacePayload(
        group,
        {},
        (group.codes ?? []).filter((item) => item.code !== code),
      ),
    ),
  );
