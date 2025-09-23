export interface AccountsQueryParams {
  /**
   * 아이디
   */
  userId?: string
}

/**
 * 계좌
 */
export interface Account {
  /**
   * 계좌 번호
   */
  accountNo?: number
  /**
   * 계좌 명
   */
  accountName?: string
}
