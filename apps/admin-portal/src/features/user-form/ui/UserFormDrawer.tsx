import type { ManagedUser, UserPayload, UserType, UseYn } from '@bx/shared';
import { useCreateUser, useDeleteUser, useUpdateUser } from '@bx/shared';

import { AdminDrawer } from '@/shared/ui/admin-drawer/AdminDrawer';
import { AdminDrawerFormActions } from '@/shared/ui/admin-drawer/AdminDrawerFormActions';
import { AppForm, FieldCell, useAppForm } from '@/shared/ui/admin-form';

const FORM_ID = 'admin-user-form';

interface UserFormValues {
  usrId: string;
  usrNm: string;
  userType: UserType;
  useYn: UseYn;
  deptName: string;
  positDivName: string;
}

const toFormValues = (user?: ManagedUser): UserFormValues => ({
  usrId: user?.usrId ?? '',
  usrNm: user?.usrNm ?? '',
  userType: user?.userType ?? 'ADMIN',
  useYn: user?.useYn ?? 'Y',
  deptName: user?.deptName ?? '',
  positDivName: user?.positDivName ?? '',
});

const toPayload = (values: UserFormValues): UserPayload => ({
  usrId: values.usrId.trim(),
  usrNm: values.usrNm.trim(),
  userType: values.userType,
  useYn: values.useYn,
  deptName: values.deptName.trim() || undefined,
  positDivName: values.positDivName.trim() || undefined,
});

interface UserFormDrawerProps {
  open: boolean;
  /** 수정 대상 사용자. 없으면 등록 모드 */
  user?: ManagedUser;
  onClose: () => void;
}

export function UserFormDrawer({ open, user, onClose }: UserFormDrawerProps) {
  const usrId = user?.usrId;
  const isUpdateMode = usrId != null;

  const defaultValues = toFormValues(user);
  const { form, FormInput, FormSelect } = useAppForm<UserFormValues>({ open, defaultValues });

  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();
  const pending = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  // 성공 시에만 닫는다. 실패는 공통 에러 알럿(MutationCache.onError)이 처리한다.
  const handleSubmit = (values: UserFormValues) => {
    const payload = toPayload(values);
    if (isUpdateMode) {
      updateMutation.mutate({ usrId, payload }, { onSuccess: onClose });
    } else {
      createMutation.mutate(payload, { onSuccess: onClose });
    }
  };

  const handleDelete = () => {
    if (!isUpdateMode) return;

    deleteMutation.mutate(usrId, { onSuccess: onClose });
  };

  return (
    <AdminDrawer
      open={open}
      title={isUpdateMode ? user?.usrNm || '관리자 수정' : '관리자 등록'}
      subtitle={isUpdateMode ? usrId : undefined}
      storageKey="admin-drawer:users"
      onClose={onClose}
      footer={
        <AdminDrawerFormActions
          formId={FORM_ID}
          pending={pending}
          deletePending={deleteMutation.isPending}
          onDelete={isUpdateMode ? handleDelete : undefined}
        />
      }
    >
      <AppForm id={FORM_ID} form={form} onSubmit={handleSubmit}>
        <FieldCell cols={6}>
          <FormInput label="아이디" name="usrId" readOnly={isUpdateMode} required />
        </FieldCell>
        <FieldCell cols={6}>
          <FormSelect label="유형" name="userType" groupCd="USER_TYPE" emptyOption="SELECT" />
        </FieldCell>
        <FieldCell cols={6}>
          <FormInput label="이름" name="usrNm" required />
        </FieldCell>
        <FieldCell cols={6}>
          <FormSelect label="사용여부" name="useYn" groupCd="USER_STATUS" emptyOption="SELECT" />
        </FieldCell>
        <FieldCell cols={6}>
          <FormInput label="부서" name="deptName" />
        </FieldCell>
        <FieldCell cols={6}>
          <FormInput label="직책" name="positDivName" />
        </FieldCell>
      </AppForm>
    </AdminDrawer>
  );
}
