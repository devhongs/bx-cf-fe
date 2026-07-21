import type { system } from '../../../shared/api/system.schema';

type SystemSchemas = system.components['schemas'];

export type BaseInfoType = 'CODE' | 'MENU';
export type BaseInfoApp = 'pc' | 'admin' | 'mobile';

export type BaseInfoReferenceDataVersion = SystemSchemas['ReferenceDataVersionLatestResponse'];
export type BaseInfoVersionApiRequest = SystemSchemas['ReferenceDataVersionLatestRequest'];

export interface BaseInfoVersion {
  type: string;
  version: string;
}

export type BaseInfoCommonCode = SystemSchemas['CommonCodeListResponse'];
export type BaseInfoCommonCodeGroup = SystemSchemas['CommonCodeGroupListResponse'] & {
  children?: BaseInfoCommonCode[];
};
export type BaseInfoMenu = SystemSchemas['MenuListResponse'];

export interface BaseInfoDataMap {
  CODE: BaseInfoCommonCodeGroup[];
  MENU: BaseInfoMenu[];
}

export interface BaseInfoCache<TType extends BaseInfoType = BaseInfoType> {
  type: TType;
  serverVersion: string;
  schemaVersion: number;
  savedAt: string;
  data: BaseInfoDataMap[TType];
}

export const BASE_INFO_TYPES = ['CODE', 'MENU'] as const satisfies readonly BaseInfoType[];

export const normalizeBaseInfoType = (type: string): BaseInfoType | null => {
  const normalizedType = type.toUpperCase();
  return BASE_INFO_TYPES.includes(normalizedType as BaseInfoType)
    ? (normalizedType as BaseInfoType)
    : null;
};
