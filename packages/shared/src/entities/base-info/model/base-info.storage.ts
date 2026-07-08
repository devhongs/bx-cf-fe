import { local } from '../../../shared/lib/utils';

import type { BaseInfoCache, BaseInfoDataMap, BaseInfoType } from './base-info.type';

export const BASE_INFO_SCHEMA_VERSION = {
  CODE: 2,
  MENU: 1,
} as const satisfies Record<BaseInfoType, number>;

const BASE_INFO_STORAGE_KEY_PREFIX = 'base-info';

export const createBaseInfoCacheKey = (type: BaseInfoType, scope?: string): string =>
  scope
    ? `${BASE_INFO_STORAGE_KEY_PREFIX}:${type}:${scope}`
    : `${BASE_INFO_STORAGE_KEY_PREFIX}:${type}`;

export const readBaseInfoCache = <TType extends BaseInfoType>(
  type: TType,
  scope?: string,
): BaseInfoCache<TType> | null =>
  local.get<BaseInfoCache<TType>>(createBaseInfoCacheKey(type, scope));

export const writeBaseInfoCache = <TType extends BaseInfoType>(
  type: TType,
  serverVersion: string,
  data: BaseInfoDataMap[TType],
  scope?: string,
): BaseInfoCache<TType> => {
  const cache = {
    type,
    serverVersion,
    schemaVersion: BASE_INFO_SCHEMA_VERSION[type],
    savedAt: new Date().toISOString(),
    data,
  } satisfies BaseInfoCache<TType>;

  local.set(createBaseInfoCacheKey(type, scope), cache);
  return cache;
};

export const isBaseInfoCacheFresh = (
  cache: BaseInfoCache | null,
  serverVersion: string,
  schemaVersion: number,
): boolean =>
  cache !== null &&
  cache.serverVersion === serverVersion &&
  cache.schemaVersion === schemaVersion &&
  cache.data !== null &&
  cache.data !== undefined;
