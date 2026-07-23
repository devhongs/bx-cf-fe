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

const toBaseInfoCommonCodeGroup = (
  group: BaseInfoCommonCodeGroup & { codes?: BaseInfoCommonCode[] },
) => {
  const { codes = [], ...rest } = group;
  return {
    ...rest,
    children: codes.map((code) => ({
      ...code,
      groupCd: code.groupCd ?? rest.groupCd,
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
  const groups = await httpService.post<
    Array<BaseInfoCommonCodeGroup & { codes?: BaseInfoCommonCode[] }>
  >('/system/common-codes/list');
  return groups.map(toBaseInfoCommonCodeGroup);
};
