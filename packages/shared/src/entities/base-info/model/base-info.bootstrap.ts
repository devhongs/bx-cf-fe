import type { HttpLoadingOptions } from '../../../shared/ajax/http.service';
import { CONFIG } from '../../../shared/constants';
import { session } from '../../../shared/lib/utils';
import type { CodeItem } from '../../../shared/types';
import {
  fetchBaseInfoCommonCodes,
  fetchBaseInfoMenus,
  fetchBaseInfoVersions,
} from '../api/base-info.api';

import {
  BASE_INFO_SCHEMA_VERSION,
  isBaseInfoCacheFresh,
  readBaseInfoCache,
  writeBaseInfoCache,
} from './base-info.storage';
import {
  BASE_INFO_TYPES,
  type BaseInfoCache,
  type BaseInfoCommonCode,
  type BaseInfoCommonCodeGroup,
  type BaseInfoDataMap,
  type BaseInfoType,
  normalizeBaseInfoType,
} from './base-info.type';

export interface BaseInfoBootstrapOptions extends HttpLoadingOptions {
  menuCacheScope?: string;
}

export interface BaseInfoBootstrapFailure {
  stage: 'versions' | 'data' | 'unexpected';
  type?: BaseInfoType;
  error?: unknown;
}

export interface BaseInfoBootstrapResult {
  reused: BaseInfoType[];
  refreshed: BaseInfoType[];
  failed: BaseInfoBootstrapFailure[];
}

const DEFAULT_MENU_CACHE_SCOPE = 'global';

const createInitialResult = (): BaseInfoBootstrapResult => ({
  reused: [],
  refreshed: [],
  failed: [],
});

const getCacheScope = (
  type: BaseInfoType,
  options?: BaseInfoBootstrapOptions,
): string | undefined =>
  type === 'MENU' ? (options?.menuCacheScope ?? DEFAULT_MENU_CACHE_SCOPE) : undefined;

const sortBySortSeq = (left?: number, right?: number): number =>
  (left ?? Number.MAX_SAFE_INTEGER) - (right ?? Number.MAX_SAFE_INTEGER);

const toCodeItems = (groups: BaseInfoCommonCodeGroup[]): BaseInfoCommonCode[] =>
  groups.flatMap((group) =>
    (group.children ?? []).map((code) => ({
      ...code,
      groupCd: code.groupCd ?? group.groupCd,
    })),
  );

const toCodeMap = (groups: BaseInfoCommonCodeGroup[]): Record<string, CodeItem[]> => {
  return toCodeItems(groups)
    .filter((code) => code.groupCd && code.code)
    .sort((left, right) => sortBySortSeq(left.sortSeq, right.sortSeq))
    .reduce<Record<string, CodeItem[]>>((acc, code) => {
      const groupCd = code.groupCd as string;
      const label = code.codeNm ?? code.code ?? '';

      acc[groupCd] ??= [];
      acc[groupCd].push({
        codeField: code.code as string,
        labelField: label,
        label,
      });

      return acc;
    }, {});
};

const hydrateBaseInfo = <TType extends BaseInfoType>(
  type: TType,
  data: BaseInfoDataMap[TType],
): void => {
  if (type === 'CODE') {
    session.set(CONFIG.SESSION.CODE, toCodeMap(data as BaseInfoDataMap['CODE']));
    return;
  }

  session.set(CONFIG.SESSION.MENU_LIST, data);
};

const hydrateCachedBaseInfo = <TType extends BaseInfoType>(
  cache: BaseInfoCache<TType> | null,
): void => {
  if (!cache) return;
  hydrateBaseInfo(cache.type, cache.data);
};

const hydrateAvailableCachedBaseInfo = (options?: BaseInfoBootstrapOptions): void => {
  for (const type of BASE_INFO_TYPES) {
    hydrateCachedBaseInfo(readBaseInfoCache(type, getCacheScope(type, options)));
  }
};

const fetchBaseInfoData = <TType extends BaseInfoType>(
  type: TType,
  options?: HttpLoadingOptions,
): Promise<BaseInfoDataMap[TType]> => {
  if (type === 'CODE') {
    return fetchBaseInfoCommonCodes(options) as Promise<BaseInfoDataMap[TType]>;
  }

  return fetchBaseInfoMenus(options) as Promise<BaseInfoDataMap[TType]>;
};

const createVersionMap = async (
  options?: HttpLoadingOptions,
): Promise<Map<BaseInfoType, string>> => {
  const versions = await fetchBaseInfoVersions(options);

  return versions.reduce<Map<BaseInfoType, string>>((acc, item) => {
    const type = normalizeBaseInfoType(item.type);
    if (type && item.version) {
      acc.set(type, item.version);
    }
    return acc;
  }, new Map());
};

const bootstrapBaseInfoType = async <TType extends BaseInfoType>(
  type: TType,
  serverVersion: string,
  result: BaseInfoBootstrapResult,
  options?: BaseInfoBootstrapOptions,
): Promise<void> => {
  const scope = getCacheScope(type, options);
  const cached = readBaseInfoCache(type, scope);

  if (isBaseInfoCacheFresh(cached, serverVersion, BASE_INFO_SCHEMA_VERSION[type])) {
    hydrateCachedBaseInfo(cached);
    result.reused.push(type);
    return;
  }

  try {
    const data = await fetchBaseInfoData(type, options);
    const cache = writeBaseInfoCache(type, serverVersion, data, scope);
    hydrateCachedBaseInfo(cache);
    result.refreshed.push(type);
  } catch (error) {
    hydrateCachedBaseInfo(cached);
    result.failed.push({ stage: 'data', type, error });
  }
};

export const bootstrapBaseInfo = async (
  options?: BaseInfoBootstrapOptions,
): Promise<BaseInfoBootstrapResult> => {
  const result = createInitialResult();
  let versionMap: Map<BaseInfoType, string>;

  try {
    versionMap = await createVersionMap(options);
  } catch (error) {
    hydrateAvailableCachedBaseInfo(options);
    result.failed.push({ stage: 'versions', error });
    return result;
  }

  await Promise.all(
    BASE_INFO_TYPES.map(async (type) => {
      const serverVersion = versionMap.get(type);
      const scope = getCacheScope(type, options);
      const cached = readBaseInfoCache(type, scope);

      if (!serverVersion) {
        hydrateCachedBaseInfo(cached);
        return;
      }

      await bootstrapBaseInfoType(type, serverVersion, result, options);
    }),
  );

  return result;
};

export const bootstrapBaseInfoSafe = async (
  options?: BaseInfoBootstrapOptions,
): Promise<BaseInfoBootstrapResult> => {
  try {
    return await bootstrapBaseInfo(options);
  } catch (error) {
    return {
      ...createInitialResult(),
      failed: [{ stage: 'unexpected', error }],
    };
  }
};
