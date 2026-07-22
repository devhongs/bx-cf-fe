import { type FieldValues, Form, type FormProps } from '@bx/shared';

import styles from './AppForm.module.css';

/** pc-web 폼 기본 입력 스타일(다크 토큰)이 걸린 Form. */
export function AppForm<TValues extends FieldValues, TPayload = TValues>(
  props: FormProps<TValues, TPayload>,
) {
  return <Form controlClassName={styles.control} {...props} />;
}
