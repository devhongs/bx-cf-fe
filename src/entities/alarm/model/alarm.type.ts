export interface AlarmsQueryParams {
  /**
   * 알람 번호
   */
  id?: string
}

/**
 * 알람
 */
export interface Alarm {
  /**
   * 알람 번호
   */
  id: number
  /**
   * 알람 명
   */
  title: string
  /**
   * 알람 잔액
   */
  description: string
  /**
   * 알람 타입
   */
  type: string
  /**
   * 알람 생성일
   */
  createdAt: string
  /**
   * 알람 수정일
   */
  updatedAt: string
}
