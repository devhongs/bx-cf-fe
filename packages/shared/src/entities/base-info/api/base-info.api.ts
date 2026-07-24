import { type HttpLoadingOptions, httpService } from '../../../shared/ajax/http.service';

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

export const fetchBaseInfoVersions = async (
  options?: HttpLoadingOptions,
): Promise<BaseInfoVersion[]> => {
  const versions = options
    ? await httpService.post<BaseInfoReferenceDataVersion[]>(
        '/system/reference-data/versions/latest',
        allReferenceDataVersionsRequest,
        options,
      )
    : await httpService.post<BaseInfoReferenceDataVersion[]>(
        '/system/reference-data/versions/latest',
        allReferenceDataVersionsRequest,
      );
  return versions.map(toBaseInfoVersion);
};

export const fetchBaseInfoMenus = (options?: HttpLoadingOptions): Promise<BaseInfoMenu[]> =>
  options
    ? httpService.post<BaseInfoMenu[]>('/system/menus/list', undefined, options)
    : httpService.post<BaseInfoMenu[]>('/system/menus/list');

export const fetchBaseInfoCommonCodes = async (
  options?: HttpLoadingOptions,
): Promise<BaseInfoCommonCodeGroup[]> => {
  const groups = options
    ? await httpService.post<Array<BaseInfoCommonCodeGroup & { codes?: BaseInfoCommonCode[] }>>(
        '/system/common-codes/list',
        undefined,
        options,
      )
    : await httpService.post<Array<BaseInfoCommonCodeGroup & { codes?: BaseInfoCommonCode[] }>>(
        '/system/common-codes/list',
      );
  return groups.map(toBaseInfoCommonCodeGroup);
};
