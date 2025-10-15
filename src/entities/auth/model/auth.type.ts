export interface AuthQueryParams {
  /**
   * 아이디
   */
  id: string /**
   * 사용자 패스워드
   */
  password: string
}

export interface Auth {
  /**
   * 사용자의 고유 ID
   */
  id: number
  /**
   * 사용자 이름
   */
  name: string
  /**
   * 사용자 이메일
   */
  email: string
  /**
   * 사용자 패스워드
   */
  password: string
}
