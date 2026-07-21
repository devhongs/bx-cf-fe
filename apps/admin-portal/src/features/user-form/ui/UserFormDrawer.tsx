import { useEffect, useState } from 'react';

import { openConfirm, useCreateUser, useDeleteUser, useFetchUser, useUpdateUser } from '@bx/shared';
import type { ManagedUser, UseYn, UserPayload, UserType } from '@bx/shared';

import { getApiErrorMessage } from '@/shared/lib/getApiErrorMessage';
import { AdminDrawer } from '@/shared/ui/admin-drawer/AdminDrawer';
import { AppForm, useAppForm } from '@/shared/ui/admin-form';

import styles from '@/shared/ui/admin-form/AdminForm.module.css';

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
  /** 수정 대상 사용자 id. 없으면 등록 모드 */
  usrId?: string;
  /** 목록 행 데이터 — 상세 응답이 오기 전이나 실패했을 때 초기값으로 사용 */
  fallback?: ManagedUser;
  onClose: () => void;
}

export function UserFormDrawer({ open, usrId, fallback, onClose }: UserFormDrawerProps) {
  const isUpdateMode = usrId != null;
  const [submitError, setSubmitError] = useState('');

  const { data: detail } = useFetchUser(usrId ?? '', {
    enabled: open && isUpdateMode,
    retry: false,
  });
  const user = detail ?? fallback;

  const defaultValues = toFormValues(user);
  const { form, FormInput, FormSelect } = useAppForm<UserFormValues>({ open, defaultValues });

  useEffect(() => {
    if (!open) return;
    setSubmitError('');
  }, [open]);

  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();
  const pending = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  const handleSubmit = async (values: UserFormValues) => {
    setSubmitError('');
    const payload = toPayload(values);

    try {
      if (isUpdateMode) {
        await updateMutation.mutateAsync({ usrId, payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      onClose();
    } catch (error) {
      setSubmitError(getApiErrorMessage(error, '저장에 실패했습니다.'));
    }
  };

  const handleDelete = async () => {
    if (!isUpdateMode) return;

    const confirmed = await openConfirm({
      message: `'${user?.usrNm ?? usrId}' 사용자를 삭제하시겠습니까?`,
    });
    if (!confirmed) return;

    setSubmitError('');
    try {
      await deleteMutation.mutateAsync(usrId);
      onClose();
    } catch (error) {
      setSubmitError(getApiErrorMessage(error, '삭제에 실패했습니다.'));
    }
  };

  return (
    <AdminDrawer
      open={open}
      title={isUpdateMode ? user?.usrNm || '관리자 수정' : '관리자 등록'}
      subtitle={isUpdateMode ? usrId : undefined}
      storageKey="admin-drawer:users"
      onClose={onClose}
      footer={
        <>
          {isUpdateMode && (
            <button
              type="button"
              className={styles.dangerButton}
              disabled={pending}
              onClick={() => void handleDelete()}
            >
              {deleteMutation.isPending ? '삭제 중' : '삭제'}
            </button>
          )}
          <button type="submit" form={FORM_ID} className={styles.button} disabled={pending}>
            {pending ? '처리 중' : '저장'}
          </button>
        </>
      }
    >
      <AppForm id={FORM_ID} form={form} onSubmit={handleSubmit}>
        <FormInput label="아이디" name="usrId" readOnly={isUpdateMode} required />
        <FormSelect label="유형" name="userType" groupCd="USER_TYPE" emptyOption="SELECT" />
        <FormInput label="이름" name="usrNm" required />
        <FormSelect label="사용여부" name="useYn" groupCd="USER_STATUS" emptyOption="SELECT" />
        <FormInput label="부서" name="deptName" />
        <FormInput label="직책" name="positDivName" />
        {submitError && <p className={styles.formError}>{submitError}</p>}
      </AppForm>
    </AdminDrawer>
  );
}
