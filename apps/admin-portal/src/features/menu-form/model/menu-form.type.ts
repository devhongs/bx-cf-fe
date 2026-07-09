import type { MenuPayload } from '@bx/shared';

export interface MenuFormValues {
  menuCd: string;
  menuNm: string;
  menuType: string;
  path: string;
  sortSeq: string;
  visibleYn: 'Y' | 'N';
}

export type MenuFormPayload = MenuPayload;
