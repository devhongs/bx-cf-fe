import { Form } from '@bx/shared';
import type { UseAppFormReturn } from '@bx/shared';

import type { MenuFormValues } from '../model/menu-form.type';

import styles from '@/shared/ui/admin-form/AdminForm.module.css';

interface MenuFormProps {
  id: string;
  form: UseAppFormReturn<MenuFormValues>['form'];
  submitError?: string;
  onSubmit: (values: MenuFormValues) => void | Promise<void>;
}

export function MenuForm({ id, form, submitError, onSubmit }: MenuFormProps) {
  return (
    <Form id={id} form={form} className={styles.form} onSubmit={onSubmit}>
      <label className={styles.field}>
        <span>메뉴코드</span>
        <input {...form.register('menuCd', { required: true })} />
        {form.formState.errors.menuCd && (
          <em className={styles.fieldError}>메뉴코드를 입력하세요.</em>
        )}
      </label>
      <label className={styles.field}>
        <span>메뉴유형</span>
        <select {...form.register('menuType')}>
          <option value="MENU">메뉴</option>
          <option value="PAGE">화면</option>
        </select>
      </label>
      <label className={`${styles.field} ${styles.fieldFull}`}>
        <span>메뉴명</span>
        <input {...form.register('menuNm', { required: true })} />
        {form.formState.errors.menuNm && (
          <em className={styles.fieldError}>메뉴명을 입력하세요.</em>
        )}
      </label>
      <label className={`${styles.field} ${styles.fieldFull}`}>
        <span>경로</span>
        <input {...form.register('path')} placeholder="/example" />
      </label>
      <label className={styles.field}>
        <span>정렬</span>
        <input type="number" {...form.register('sortSeq')} />
      </label>
      <label className={styles.field}>
        <span>노출여부</span>
        <select {...form.register('visibleYn')}>
          <option value="Y">노출</option>
          <option value="N">숨김</option>
        </select>
      </label>
      {submitError && <p className={styles.formError}>{submitError}</p>}
    </Form>
  );
}
