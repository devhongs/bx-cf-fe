import type { system as systemApi } from '../../../shared/api';

type SystemSchemas = systemApi.components['schemas'];

export type CommonCodeGroupListItem = SystemSchemas['CommonCodeGroupListResponse'];
export type CommonCodeGroupDetail = SystemSchemas['CommonCodeGroupDetailDetailResponse'];
export type CommonCodeGroup = CommonCodeGroupListItem & Partial<CommonCodeGroupDetail>;
export type CommonCodeGroupPayload = SystemSchemas['CommonCodeGroupReqDto'];
export type CommonCodeGroupListApiRequest = SystemSchemas['ApiRequestCommonCodeGroupReqDto'];
export type CommonCodeGroupQueryParams = CommonCodeGroupPayload &
  SystemSchemas['FilterReqDto'] &
  SystemSchemas['PaginationReqDto'] &
  SystemSchemas['SortReqDto'];

export type CommonCode = SystemSchemas['CommonCodeListResponse'];
export type CommonCodePayload = SystemSchemas['CommonCodeReqDto'];
export type CommonCodeListApiRequest = SystemSchemas['ApiRequestCommonCodeReqDto'];
export type CommonCodeQueryParams = CommonCodePayload &
  SystemSchemas['FilterReqDto'] &
  SystemSchemas['PaginationReqDto'] &
  SystemSchemas['SortReqDto'];
