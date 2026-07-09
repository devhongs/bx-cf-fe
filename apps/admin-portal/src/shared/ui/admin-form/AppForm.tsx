import { type FieldValues, Form, type FormProps } from '@bx/shared';

import styles from './AdminForm.module.css';

/** admin 공통 스타일(그리드 필드 레이아웃·에러 스타일)이 기본으로 걸린 Form. */
export function AppForm<TValues extends FieldValues, TPayload = TValues>(
  props: FormProps<TValues, TPayload>,
) {
  return (
    <Form
      className={styles.form}
      fieldClassName={styles.field}
      errorClassName={styles.fieldError}
      {...props}
    />
  );
}
