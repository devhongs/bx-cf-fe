import { cn, type FieldValues, Form, type FormProps } from '@bx/shared';

import styles from './AdminForm.module.css';

/** admin 공통 스타일(12칸 배치 그리드·에러 스타일)이 기본으로 걸린 Form. */
export function AppForm<TValues extends FieldValues, TPayload = TValues>({
  className,
  ...props
}: FormProps<TValues, TPayload>) {
  return (
    <Form
      className={cn(styles.form, className)}
      fieldClassName={styles.field}
      errorClassName={styles.fieldError}
      {...props}
    />
  );
}
