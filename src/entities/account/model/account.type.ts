
export interface AccountsQueryParams extends PaginationRequest {
/**
 * 과정 정보
 */
export interface Account {
  /**
   * 아이디
   */
  id?: number;
  /**
   * 이름
   */
  name?: string;
}
