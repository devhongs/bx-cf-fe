import { type FieldValues, type UseBaseFormProps, useBaseForm } from '@bx/shared';

/**
 * admin 폼 공통 훅. 드로어 기반 CRUD라 조회 결과가 도착하면 폼을 갱신해야 하므로
 * `resetOnDefaultValuesChange`를 기본 활성화한다. 필요하면 개별 폼에서 끌 수 있다.
 */
export function useAppForm<TValues extends FieldValues>(props: UseBaseFormProps<TValues>) {
  return useBaseForm<TValues>({ resetOnDefaultValuesChange: true, ...props });
}
