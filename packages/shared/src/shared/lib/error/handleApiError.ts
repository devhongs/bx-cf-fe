import { type ApiError, type ApiErrorKind, toApiError } from '../../ajax/api-error';
import { useAlertStore } from '../../model/alert/alert.store';

/**
 * 화면별 에러 처리 정책. TanStack Query의 `meta.error`로 전달한다.
 *
 * ```ts
 * useQuery({ ...opts, meta: { error: { silent: true } } });                       // 화면이 직접 처리
 * useMutation({ ...opts, meta: { error: { onClose: () => nav({ to: '/list' }) } } }); // 알럿 닫힌 뒤 후처리
 * useQuery(opts);                                                                 // 공통 처리(기본)
 * ```
 */
export interface ErrorPolicy {
  /** 공통 에러 UI를 띄우지 않는다. 화면에서 직접 처리할 때 사용. */
  silent?: boolean | ((error: ApiError) => boolean);
  /** 특정 에러 코드만 공통 처리에서 제외한다. */
  ignoreCodes?: string[];
  /** 알럿에 띄울 메시지 오버라이드. 생략하면 서버 msg를 쓴다. */
  message?: string | ((error: ApiError) => string);
  /** 공통 알럿이 닫힌 뒤 실행된다. */
  onClose?: (error: ApiError) => void;
}

/**
 * 공통 처리에서 제외하는 성격.
 * - canceled: 사용자에게 알릴 실패가 아니다.
 * - auth    : http.service 인터셉터가 재발급/로그아웃으로 이미 처리했다. 여기서 또 띄우면 중복.
 */
const SKIPPED_KINDS: ApiErrorKind[] = ['canceled', 'auth'];

/**
 * TanStack Router의 redirect는 throw로 전달되므로 에러로 오인하면 안 된다.
 * (shared가 라우터에 의존하지 않도록 구조적으로 판별한다)
 */
const isRouterRedirect = (error: unknown): boolean =>
  typeof error === 'object' &&
  error !== null &&
  (error as { isRedirect?: unknown }).isRedirect === true;

const resolveMessage = (error: ApiError, policy?: ErrorPolicy): string => {
  if (typeof policy?.message === 'function') return policy.message(error);
  return policy?.message ?? error.message;
};

const isSilent = (error: ApiError, policy?: ErrorPolicy): boolean => {
  if (typeof policy?.silent === 'function') return policy.silent(error);
  if (policy?.silent) return true;
  return policy?.ignoreCodes?.includes(error.code) ?? false;
};

/**
 * 모든 통신 에러의 중앙 진입점.
 * QueryCache/MutationCache의 onError에서 호출되고, Query를 쓰지 않는 곳에서는 직접 호출한다.
 */
export const handleApiError = async (rawError: unknown, policy?: ErrorPolicy): Promise<void> => {
  if (isRouterRedirect(rawError)) return;

  const error = toApiError(rawError);
  console.error(`[api] ${error.kind} ${error.code} ${error.url ?? ''}`, error);

  if (SKIPPED_KINDS.includes(error.kind)) return;
  if (isSilent(error, policy)) return;

  const message = resolveMessage(error, policy);

  // 병렬 요청이 같은 이유로 무더기 실패했을 때 알럿이 쌓이는 것을 막는다.
  const isDuplicate = useAlertStore.getState().queue.some((entry) => entry.message === message);
  if (isDuplicate) return;

  await useAlertStore.getState().open({ message });
  policy?.onClose?.(error);
};
