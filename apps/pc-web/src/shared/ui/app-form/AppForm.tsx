import { type FieldValues, Form, type FormProps, cn } from '@bx/shared';

import styles from './AppForm.module.css';

/** pc-web 폼 기본 입력 스타일(다크 토큰)과 12칸 배치 그리드가 걸린 Form. */
export function AppForm<TValues extends FieldValues, TPayload = TValues>({
  className,
  ...props
}: FormProps<TValues, TPayload>) {
  return (
    <Form className={cn(styles.form, className)} controlClassName={styles.control} {...props} />
  );
}
