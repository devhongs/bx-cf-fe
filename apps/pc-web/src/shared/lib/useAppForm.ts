import { type FieldValues, type UseBaseFormProps, useBaseForm } from '@bx/shared';

/**
 * pc-web 폼 공통 훅. 현재는 공통 기본값이 없어 base를 그대로 위임하지만,
 * 앱 전역 폼 정책이 생기면 여기에 얹는다.
 */
export function useAppForm<TValues extends FieldValues>(props: UseBaseFormProps<TValues>) {
  return useBaseForm<TValues>(props);
}
