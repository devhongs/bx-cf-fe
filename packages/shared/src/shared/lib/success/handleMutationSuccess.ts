import { toast } from '../../ui/toast';

/**
 * 뮤테이션 성공 시 공통 토스트 정책. TanStack Query의 `meta.success`로 전달한다.
 *
 * 성공은 기본적으로 조용하다(결과가 화면에 반영되므로). 사용자에게 명시적으로
 * 알려야 하는 상황에서만 켠다. 에러(`meta.error`)와 반대로 **opt-in**이다.
 *
 * ```ts
 * useMutation({ ...opts, meta: { success: true } });                       // 공통 문구 토스트
 * useMutation({ ...opts, meta: { success: { message: '전송되었습니다.' } } }); // 문구 오버라이드
 * useMutation(opts);                                                       // 조용(기본)
 * ```
 */
export interface SuccessPolicy {
  /** 토스트 문구 오버라이드. 생략하면 공통 문구를 쓴다. */
  message?: string;
}

/** `meta.success`에 넣는 값. `true`면 공통 문구, 객체면 문구 오버라이드. */
export type SuccessMeta = boolean | SuccessPolicy;

/** 사이트별로 다르면 여기만 고친다. */
export const DEFAULT_SUCCESS_MESSAGE = '성공했습니다.';

/**
 * 뮤테이션 성공의 중앙 진입점. MutationCache의 onSuccess에서 호출된다.
 * `meta.success`가 없으면 아무것도 하지 않는다(기본은 조용).
 */
export const handleMutationSuccess = (policy?: SuccessMeta): void => {
  if (!policy) return;

  const message =
    typeof policy === 'object'
      ? (policy.message ?? DEFAULT_SUCCESS_MESSAGE)
      : DEFAULT_SUCCESS_MESSAGE;
  toast.success(message);
};
