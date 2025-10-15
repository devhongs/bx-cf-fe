export type BankId =
  | 'KB' // 국민
  | 'SHINHAN' // 신한
  | 'WOORI' // 우리
  | 'HANA' // 하나
  | 'NH' // 농협
  | 'IBK' // 기업
  | 'KAKAO' // 카카오뱅크
  | 'TOSS' // 토스뱅크
  | 'ETC' // 기타 (fallback)

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
   * 은행 식별자 (국민=KB, 신한=SHINHAN 등)
   */
  bankId: BankId

  /**
   * 계좌 번호
   */
  accountNo: string
  /**
   * 계좌 명
   */
  accountName: string
  /**
   * 계좌 잔액
   */
  amount: number
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
