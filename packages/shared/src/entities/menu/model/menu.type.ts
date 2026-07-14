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
export type MenuDetail = SystemSchemas['MenuDetailResponse'];
type MenuCreatePayload = SystemSchemas['MenuCreateRequest']['data'];
type MenuUpdatePayload = SystemSchemas['MenuUpdateRequest']['data'];
type LegacyListParams = {
  page?: number;
  size?: number;
  keyword?: string;
  searchType?: string;
  sort?: string;
};
export type MenuPayload = Partial<MenuCreatePayload & MenuUpdatePayload> &
  Partial<LegacyMenuFields>;
export type MenuQueryParams = Partial<MenuListItem & MenuPayload & LegacyListParams>;

export type Menu = (MenuListItem | MenuDetail) &
  LegacyMenuFields & {
    children?: Array<Menu>;
  };
