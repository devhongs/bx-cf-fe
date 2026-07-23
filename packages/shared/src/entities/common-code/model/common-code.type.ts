import type { system as systemApi } from '../../../shared/api';

type SystemSchemas = systemApi.components['schemas'];
type LegacyListParams = {
  page?: number;
  size?: number;
  keyword?: string;
  searchType?: string;
  sort?: string;
};

export type CommonCodeGroupListItem = SystemSchemas['CommonCodeGroupListResponse'];
type CommonCodeGroupDetailItem = SystemSchemas['CommonCodeGroupDetailDetailResponse'];
type CommonCodeGroupDetailListItem = SystemSchemas['CommonCodeGroupDetailListResponse'];
export type CommonCodeGroup = CommonCodeGroupListItem &
  Partial<CommonCodeGroupDetailItem> &
  Partial<CommonCodeGroupDetailListItem>;
type CommonCodeCreateCreatePayload = SystemSchemas['CommonCodeCreateCreateRequest']['data'];
type CommonCodeReplaceApiPayload = SystemSchemas['CommonCodeReplaceReplaceRequest']['data'];
export type CommonCode = SystemSchemas['CommonCodeListResponse'] &
  NonNullable<CommonCodeGroupDetailItem['codes']>[number] &
  NonNullable<CommonCodeGroupDetailListItem['codes']>[number];
type CommonCodeCreatePayload = SystemSchemas['CommonCodeCreateRequest']['data'];
type CommonCodeReplacePayloadItem = SystemSchemas['CommonCodeReplaceRequest']['data'];
export type CommonCodePayload = Partial<CommonCodeCreatePayload & CommonCodeReplacePayloadItem>;
export type CommonCodeGroupPayload = Partial<
  Omit<CommonCodeCreateCreatePayload, 'codes'> & Omit<CommonCodeReplaceApiPayload, 'codes'>
> & {
  codes?: CommonCodePayload[];
};
export type CommonCodeGroupQueryParams = Partial<
  CommonCodeGroupListItem & CommonCodeGroupPayload & LegacyListParams
>;
export type CommonCodeReplacePayload = Partial<Omit<CommonCodeReplaceApiPayload, 'codes'>> & {
  codes: CommonCodePayload[];
};
