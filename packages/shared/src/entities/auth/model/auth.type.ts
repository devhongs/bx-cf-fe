/**
 * 인증(JWT) 관련 타입
 * Spring 백엔드 응답 스펙 기준.
 */

/** 로그인 요청 바디 */
export interface LoginRequest {
  /** 사용자 아이디 */
  usrId: string;
  /** 비밀번호 (SHA-256 해시) */
  usrPwd: string;
}

/** 인증된 사용자 정보 */
export interface AuthUser {
  /** 사용자 아이디 */
  usrId: string;
  /** 사용자 이름 */
  usrNm: string;
  /** 직위 구분명 */
  positDivName: string;
  /** 부서명 */
  deptName: string;
  /** 권한 목록 */
  roles: Array<string>;
}

/** JWT 토큰 정보 */
export interface AuthTokens {
  /** 액세스 토큰 */
  accessToken: string;
  /** 액세스 토큰 만료시각 (yyyyMMddHHmmss) */
  accessTokenExpiresAt: string;
  /** 리프레시 토큰 */
  refreshToken: string;
  /** 리프레시 토큰 만료시각 (yyyyMMddHHmmss) */
  refreshTokenExpiresAt: string;
}

/**
 * 로그인/리프레시 응답 payload.
 * 사용자 정보 + 토큰 정보가 함께 내려온다.
 */
export interface LoginResponse extends AuthUser, AuthTokens {
  /** 비밀번호 (응답에서는 항상 null) */
  usrPwd: string | null;
}
