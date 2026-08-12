import {
  type FieldValues,
  type UseBaseFormProps,
  type UseBaseFormReturn,
  useBaseForm,
} from '@bx/shared';
import { useEffect, useRef } from 'react';

export interface UseAppFormProps<TValues extends FieldValues> extends UseBaseFormProps<TValues> {
  /**
   * 드로어/모달의 열림 상태. 넘기면 **닫힘 → 열림** 순간마다 폼을 초기값으로 되돌린다.
   *
   * admin CRUD 드로어는 닫아도 언마운트되지 않고(`open`만 토글) 재사용된다.
   * `resetOnDefaultValuesChange`는 초기값이 "달라질" 때만 도는 탓에,
   * 같은 행을 다시 열거나 등록 폼을 다시 열면 직전 입력이 그대로 남는다.
   * 열림 자체를 리셋 신호로 삼아 화면마다 같은 effect를 반복하지 않게 한다.
   */
  open?: boolean;
}

/**
 * admin 폼 공통 훅. 드로어 기반 CRUD라 조회 결과가 도착하면 폼을 갱신해야 하므로
 * `resetOnDefaultValuesChange`를 기본 활성화한다. 필요하면 개별 폼에서 끌 수 있다.
 */
export function useAppForm<TValues extends FieldValues>({
  open,
  ...props
}: UseAppFormProps<TValues>): UseBaseFormReturn<TValues> {
  const result = useBaseForm<TValues>({ resetOnDefaultValuesChange: true, ...props });
  const { resetToDefaultValues } = result;
  const wasOpenRef = useRef(open);

  useEffect(() => {
    if (open === undefined) return;

    const justOpened = open && !wasOpenRef.current;
    wasOpenRef.current = open;
    if (justOpened) resetToDefaultValues();
  }, [open, resetToDefaultValues]);

  return result;
}
