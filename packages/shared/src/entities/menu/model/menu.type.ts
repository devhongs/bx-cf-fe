export interface MenuQueryParams {
  /**
   * 아이디
   */
  userId?: string;
}

/**
 * 메뉴
 */
export interface Menu {
  /** 메뉴 번호 */
  id: number;
  /** 메뉴명 */
  name: string;
  /** 아이콘 */
  iconType: string;
  /** 하위 메뉴 목록 */
  children?: Array<Menu>;
  /** 메뉴 계층 레벨 */
  level: number;
}
