/**
 * 하위 호환용 재노출.
 * 인증 스토어가 entities/auth로 이동했으므로, 기존 `useUserStore` 사용처를 위해 별칭을 유지한다.
 * 신규 코드는 `useAuthStore`를 직접 사용하세요.
 */
export { useAuthStore as useUserStore } from '../../auth';
