import { httpService } from '../../../shared/ajax/http.service';

import type {
  BaseInfoCommonCode,
  BaseInfoCommonCodeGroup,
  BaseInfoMenu,
  BaseInfoReferenceDataVersion,
  BaseInfoVersion,
  BaseInfoVersionApiRequest,
} from '../model/base-info.type';

const allReferenceDataVersionsRequest: BaseInfoVersionApiRequest = {
  data: { refType: 'ALL' },
};

const toBaseInfoVersion = (item: BaseInfoReferenceDataVersion): BaseInfoVersion => ({
  type: item.refType ?? '',
  version: item.versionNo ?? '',
});

const fetchBaseInfoCodesByGroup = async (groupCd: string): Promise<BaseInfoCommonCode[]> =>
  httpService.post<BaseInfoCommonCode[]>(
    `/system/common-codes/groups/${encodeURIComponent(groupCd)}/codes/list`,
  );

const attachCodesToGroup = async (
  group: BaseInfoCommonCodeGroup,
): Promise<BaseInfoCommonCodeGroup> => {
  if (!group.groupCd) return { ...group, children: [] };

  const codes = await fetchBaseInfoCodesByGroup(group.groupCd);
  return {
    ...group,
    children: codes.map((code) => ({
      ...code,
      groupCd: code.groupCd ?? group.groupCd,
    })),
  };
};

export const fetchBaseInfoVersions = async (): Promise<BaseInfoVersion[]> => {
  const versions = await httpService.post<BaseInfoReferenceDataVersion[]>(
    '/system/reference-data/versions/latest',
    allReferenceDataVersionsRequest,
  );
  return versions.map(toBaseInfoVersion);
};

export const fetchBaseInfoMenus = (): Promise<BaseInfoMenu[]> =>
  httpService.post<BaseInfoMenu[]>('/system/menus/list');

export const fetchBaseInfoCommonCodes = async (): Promise<BaseInfoCommonCodeGroup[]> => {
  const groups = await httpService.post<BaseInfoCommonCodeGroup[]>(
    '/system/common-codes/groups/list',
  );
  return Promise.all(groups.map(attachCodesToGroup));
};
