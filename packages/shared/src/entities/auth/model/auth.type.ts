/**
 * 인증(JWT) 관련 타입
 * Spring 백엔드 응답 스펙 기준.
 *
 * 백엔드 OpenAPI 스펙(`shared/api/auth.schema.d.ts`)에서 생성된 `LoginDto`를
 * 단일 소스로 삼아 파생한다. 백엔드가 필드명을 바꾸면 아래 Pick에서
 * 컴파일 에러가 발생하므로 드리프트를 즉시 감지할 수 있다.
 * → 스펙 재생성: `pnpm gen:api`
 */
import type { auth } from '../../../shared/api';

type AuthLoginResponse = auth.components['schemas']['AuthLoginResponse'];
type AuthRefreshTokenResponse = auth.components['schemas']['AuthRefreshTokenResponse'];
type AuthLoginRequest = auth.components['schemas']['AuthLoginRequest'];
/** 백엔드 응답 payload DTO (자동 생성 — 응답 전용) */
type AuthResponse = AuthLoginResponse | AuthRefreshTokenResponse;

/**
 * 로그인 요청 바디 (usrPwd는 SHA-256 해시).
 * 백엔드 요청 바디는 ApiRequest 래퍼로 감싸지만, 화면/훅에서는
 * 실제 로그인 입력값만 다루도록 유지한다.
 */
export type LoginRequest = AuthLoginRequest['data'];
export type LoginApiRequest = AuthLoginRequest;

/** 인증된 사용자 정보 */
export type AuthUser = Pick<
  AuthResponse,
  'usrId' | 'usrNm' | 'positDivName' | 'deptName' | 'roles'
>;

/** JWT 토큰 정보 (만료시각 형식: yyyyMMddHHmmss) */
export type AuthTokens = Required<Pick<AuthResponse, 'accessToken' | 'accessTokenExpiresAt'>>;

/** 로그인/리프레시 응답 payload. refreshToken은 HttpOnly Cookie로 관리한다. */
export type LoginResponse = AuthResponse;
