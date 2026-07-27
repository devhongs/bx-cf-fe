import { AppForm, FieldCell, useAppForm } from '@/shared/ui/admin-form';

import type { MenuFormPayload, MenuFormValues } from '../model/menu-form.type';

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
  /** 드로어에 얹을 때 열림 상태를 넘기면 재오픈 시 폼이 초기값으로 돌아간다. */
  open?: boolean;
  defaultValues?: MenuFormValues;
  onSubmit: (payload: MenuFormPayload) => void | Promise<void>;
}

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
  open,
  defaultValues = emptyDefaultValues,
  onSubmit,
}: MenuFormProps) {
  const { form, FormInput, FormSelect } = useAppForm<MenuFormValues>({ open, defaultValues });

  const handleSubmit = (values: MenuFormValues) => onSubmit(toPayload(values));

  return (
    <AppForm id={id} form={form} onSubmit={handleSubmit}>
      <FieldCell cols={6}>
        <FormInput label="메뉴코드" name="menuCd" required />
      </FieldCell>
      <FieldCell cols={6}>
        <FormSelect label="메뉴유형" name="menuType" groupCd="MENU_TYPE" emptyOption="SELECT" />
      </FieldCell>

      <FormInput label="메뉴명" name="menuNm" required />
      <FormInput label="경로" name="path" placeholder="/example" />

      <FieldCell cols={6}>
        <FormInput label="정렬" name="sortSeq" type="number" />
      </FieldCell>
      <FieldCell cols={6}>
        <FormSelect label="노출여부" name="visibleYn" groupCd="VISIBLE_YN" emptyOption="SELECT" />
      </FieldCell>
    </AppForm>
  );
}
