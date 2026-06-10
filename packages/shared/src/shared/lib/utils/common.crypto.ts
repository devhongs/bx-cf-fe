/**
 * 암호화/해시 유틸
 * Web Crypto API(crypto.subtle) 기반 — 외부 의존성 없음.
 */

/**
 * 문자열을 SHA-256 해시(소문자 hex 문자열)로 변환한다.
 * 로그인 시 비밀번호 해싱에 사용.
 *
 * @example
 *   const hash = await sha256('password'); // "5e88489..."
 */
export async function sha256(text: string): Promise<string> {
  const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}
