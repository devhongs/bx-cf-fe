export type BankId =
  | 'KB' // 국민
  | 'SH' // 신한
  | 'HN' // 하나
  | 'WR' // 우리
  | 'NH' // 농협
  | 'IBK' // 기업
  | 'KDB' // 산업
  | 'SC' // SC제일
  | 'CT' // 씨티
  | 'KT' // 케이뱅크
  | 'KK' // 카카오뱅크
  | 'TS' // 토스뱅크
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
  id: string

  /**
   * 은행 식별자 (국민=KB, 신한=SHINHAN 등)
   */
  bankId: BankId
  /**
   * 예금주 이름
   */
  name: string
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
   * 즐겨찾기 여부 (true = 대표 계좌)
   */
  isFavorite: boolean
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
