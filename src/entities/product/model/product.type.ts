export interface ProductQueryParams {
  /**
   * 아이디
   */
  userId?: string
}

export interface Product {
  /**
   * 제품의 고유 ID
   */
  id: number
  /**
   * 상품명
   */
  name: string
  /**
   * 상품 설명
   */
  description: string
  /**
   * 상품 아이콘 (이름)
   */
  icon: string
  /**
   * 상품 아이콘 색상
   */
  iconColor: string
  /**
   * 기본 금리
   */
  baseRate: number
  /**
   * 최대 금리
   */
  maxRate: number
  /**
   * 금리 설명
   */
  rateDescription: string
  /**
   * 상품 유형 (예: 'deposit', 'loan')
   */
  type: 'deposit' | 'loan'
}
