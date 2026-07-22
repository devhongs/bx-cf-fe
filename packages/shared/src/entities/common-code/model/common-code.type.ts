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
export type CommonCodeGroupDetail = SystemSchemas['CommonCodeGroupDetailResDto'];
export type CommonCodeGroup = CommonCodeGroupListItem & Partial<CommonCodeGroupDetail>;
type CommonCodeGroupCreatePayload = SystemSchemas['CommonCodeGroupCreateRequest']['data'];
type CommonCodeGroupUpdatePayload = SystemSchemas['CommonCodeGroupUpdateRequest']['data'];
type CommonCodeReplaceApiPayload = SystemSchemas['CommonCodeReplaceReplaceRequest']['data'];
export type CommonCodeGroupPayload = Partial<
  CommonCodeGroupCreatePayload & CommonCodeGroupUpdatePayload
>;
export type CommonCodeGroupQueryParams = Partial<
  CommonCodeGroupListItem & CommonCodeGroupPayload & LegacyListParams
>;

export type CommonCode = SystemSchemas['CommonCodeListResponse'];
type CommonCodeCreatePayload = SystemSchemas['CommonCodeCreateRequest']['data'];
type CommonCodeUpdatePayload = SystemSchemas['CommonCodeUpdateRequest']['data'];
export type CommonCodePayload = Partial<CommonCodeCreatePayload & CommonCodeUpdatePayload>;
export type CommonCodeQueryParams = Partial<CommonCode & CommonCodePayload & LegacyListParams>;
export type CommonCodeReplacePayload = Omit<CommonCodeReplaceApiPayload, 'items'> & {
  items: CommonCodePayload[];
};
export type CommonCodeAuthParams = {
  authUser: string;
};
