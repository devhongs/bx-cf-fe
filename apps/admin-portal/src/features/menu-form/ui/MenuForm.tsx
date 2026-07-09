import { Form, FormInput, FormSelect, useAppForm } from '@bx/shared';

import type { MenuFormPayload, MenuFormValues } from '../model/menu-form.type';

import styles from '@/shared/ui/admin-form/AdminForm.module.css';

const emptyDefaultValues: MenuFormValues = {
  menuCd: '',
  menuNm: '',
  menuType: 'MENU',
  path: '',
  sortSeq: '',
  visibleYn: 'Y',
};

interface MenuFormProps {
  id: string;
  defaultValues?: MenuFormValues;
  submitError?: string;
  onSubmit: (payload: MenuFormPayload) => void | Promise<void>;
}

const menuTypeOptions = [
  { value: 'MENU', label: '메뉴' },
  { value: 'PAGE', label: '화면' },
];

const visibleOptions = [
  { value: 'Y', label: '노출' },
  { value: 'N', label: '숨김' },
];

const fieldClassName = (full = false) =>
  full ? `${styles.field} ${styles.fieldFull}` : styles.field;

const toPayload = (values: MenuFormValues): MenuFormPayload => ({
  menuCd: values.menuCd.trim(),
  menuNm: values.menuNm.trim(),
  menuType: values.menuType,
  path: values.path.trim() || undefined,
  sortSeq: values.sortSeq === '' ? undefined : Number(values.sortSeq),
  visibleYn: values.visibleYn,
});

export function MenuForm({
  id,
  defaultValues = emptyDefaultValues,
  submitError,
  onSubmit,
}: MenuFormProps) {
  const { form } = useAppForm<MenuFormValues>({
    defaultValues,
    resetOnDefaultValuesChange: true,
  });

  const MenuInput = FormInput<MenuFormValues>;
  const MenuSelect = FormSelect<MenuFormValues>;

  const handleSubmit = (values: MenuFormValues) => onSubmit(toPayload(values));

  return (
    <Form id={id} form={form} className={styles.form} onSubmit={handleSubmit}>
      <MenuInput
        errorClassName={styles.fieldError}
        fieldClassName={fieldClassName()}
        label="메뉴코드"
        name="menuCd"
        required
      />
      <MenuSelect
        errorClassName={styles.fieldError}
        fieldClassName={fieldClassName()}
        label="메뉴유형"
        name="menuType"
        options={menuTypeOptions}
      />
      <MenuInput
        errorClassName={styles.fieldError}
        fieldClassName={fieldClassName(true)}
        label="메뉴명"
        name="menuNm"
        required
      />
      <MenuInput
        errorClassName={styles.fieldError}
        fieldClassName={fieldClassName(true)}
        label="경로"
        name="path"
        placeholder="/example"
      />
      <MenuInput
        errorClassName={styles.fieldError}
        fieldClassName={fieldClassName()}
        label="정렬"
        name="sortSeq"
        type="number"
      />
      <MenuSelect
        errorClassName={styles.fieldError}
        fieldClassName={fieldClassName()}
        label="노출여부"
        name="visibleYn"
        options={visibleOptions}
      />
      {submitError && <p className={styles.formError}>{submitError}</p>}
    </Form>
  );
}
