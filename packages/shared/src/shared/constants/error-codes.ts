/**
 * API 공통 응답(envelope)의 에러 코드.
 * 성공 시 code는 "0", 실패 시 음수 문자열.
 */
export const API_ERROR_CODE = {
  /** 필수 입력값 누락 */
  REQUIRED_VALUE_MISSING: '-1001',
  /** 유효하지 않은 토큰 */
  INVALID_TOKEN: '-1002',
  /** 인증되지 않은 클라이언트 */
  UNAUTHORIZED_CLIENT: '-1003',
  /** 토큰 유효시간 만료 (Refresh 필요) */
  EXPIRED_TOKEN: '-1004',
  /** 해당 리소스 접근 권한 없음 */
  ACCESS_DENIED: '-1005',
  /** JSON 문자열 파싱 오류 */
  JSON_STR_TO_VO_PARSING: '-2003',
  /** VO 객체 JSON 변환 오류 */
  JSON_VO_TO_STR_PARSING: '-2004',
  /** DB 데이터 조회 실패 */
  DB_NO_DATA_ERROR: '-4001',
  /** DB 데이터 저장 오류 */
  DB_SAVE_DATA_ERROR: '-4002',
  /** 서버 내부 시스템 오류 */
  SERVER_ERROR: '-9999',
} as const;

export type ApiErrorCode = (typeof API_ERROR_CODE)[keyof typeof API_ERROR_CODE];

/** 재발급(refresh)을 시도해야 하는 코드 */
export const isExpiredTokenCode = (code?: string): boolean => code === API_ERROR_CODE.EXPIRED_TOKEN;

/** 즉시 로그아웃해야 하는(재발급 불가) 인증 실패 코드 */
export const isFatalAuthCode = (code?: string): boolean =>
  code === API_ERROR_CODE.INVALID_TOKEN || code === API_ERROR_CODE.UNAUTHORIZED_CLIENT;
