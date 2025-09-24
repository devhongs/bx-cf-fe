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
  /**
   * 계좌 잔액
   */
  amount?: number
  /**
   * 계좌 타입
   */
  accountType?: string
  /**
   * 계좌 상태
   */
  accountStatus?: string
  /**
   * 계좌 생성일
   */
  createdAt?: string
  /**
   * 계좌 수정일
   */
  updatedAt?: string
}
