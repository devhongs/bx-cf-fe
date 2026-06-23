/**
 * 인증(JWT) 관련 타입
 * Spring 백엔드 응답 스펙 기준.
 *
 * 백엔드 OpenAPI 스펙(`shared/api/schema.d.ts`)에서 생성된 `LoginDto`를
 * 단일 소스로 삼아 파생한다. 백엔드가 필드명을 바꾸면 아래 Pick에서
 * 컴파일 에러가 발생하므로 드리프트를 즉시 감지할 수 있다.
 * → 스펙 재생성: `pnpm gen:api`
 */
import type { components } from '../../../shared/api/schema';

/** 백엔드 응답 payload DTO (자동 생성 — 응답 전용, 필드 optional) */
type AuthResponse = components['schemas']['AuthResponse'];

/**
 * 로그인 요청 바디 (usrPwd는 SHA-256 해시).
 * 백엔드가 요청 DTO를 분리하고 usrId/usrPwd를 required로 지정해
 * 별도 보정 없이 생성 타입을 그대로 사용한다.
 */
export type LoginRequest = components['schemas']['AuthLoginRequest'];

/** 인증된 사용자 정보 */
export type AuthUser = Required<
  Pick<AuthResponse, 'usrId' | 'usrNm' | 'positDivName' | 'deptName' | 'roles'>
>;

/** JWT 토큰 정보 (만료시각 형식: yyyyMMddHHmmss) */
export type AuthTokens = Required<
  Pick<
    AuthResponse,
    'accessToken' | 'accessTokenExpiresAt' | 'refreshToken' | 'refreshTokenExpiresAt'
  >
>;

/**
 * 로그인/리프레시 응답 payload.
 * 사용자 정보 + 토큰 정보가 함께 내려온다. (usrPwd는 응답에서 항상 null)
 */
export type LoginResponse = AuthUser & AuthTokens & { usrPwd: string | null };
