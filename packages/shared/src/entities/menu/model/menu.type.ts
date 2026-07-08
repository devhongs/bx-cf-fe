import type { system as systemApi } from '../../../shared/api';

type SystemSchemas = systemApi.components['schemas'];

type LegacyMenuFields = {
  /** Legacy mobile menu id. Prefer menuId for new code. */
  id?: number;
  /** Legacy mobile menu name. Prefer menuNm for new code. */
  name?: string;
  /** Legacy mobile icon name. Prefer icon for new code. */
  iconType?: string;
  /** Legacy mobile depth. Prefer depth for new code. */
  level?: number;
};

export type MenuListItem = SystemSchemas['MenuListResponse'];
export type MenuPayload = SystemSchemas['MenuReqDto'] & Partial<LegacyMenuFields>;
export type MenuListApiRequest = SystemSchemas['ApiRequestMenuReqDto'];
export type MenuQueryParams = MenuPayload &
  SystemSchemas['FilterReqDto'] &
  SystemSchemas['PaginationReqDto'] &
  SystemSchemas['SortReqDto'];

export type Menu = MenuListItem &
  LegacyMenuFields & {
    children?: Array<Menu>;
  };
