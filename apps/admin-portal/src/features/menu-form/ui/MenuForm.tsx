import { AppForm, useAppForm } from '@/shared/ui/admin-form';

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

const fullFieldClassName = `${styles.field} ${styles.fieldFull}`;

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
  const { form, FormInput, FormSelect } = useAppForm<MenuFormValues>({ defaultValues });

  const handleSubmit = (values: MenuFormValues) => onSubmit(toPayload(values));

  return (
    <AppForm id={id} form={form} onSubmit={handleSubmit}>
      <FormInput label="메뉴코드" name="menuCd" required />
      <FormSelect label="메뉴유형" name="menuType" groupCd="MENU_TYPE" emptyOption="SELECT" />
      <FormInput label="메뉴명" name="menuNm" required fieldClassName={fullFieldClassName} />
      <FormInput
        label="경로"
        name="path"
        placeholder="/example"
        fieldClassName={fullFieldClassName}
      />
      <FormInput label="정렬" name="sortSeq" type="number" />
      <FormSelect label="노출여부" name="visibleYn" groupCd="VISIBLE_YN" emptyOption="SELECT" />
      {submitError && <p className={styles.formError}>{submitError}</p>}
    </AppForm>
  );
}
