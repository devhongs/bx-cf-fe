import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';

import { createUser, deleteUser, updateUser, userDetailQuery, userQueryKeys } from '@bx/shared';
import type { ManagedUser, UseYn, UserPayload, UserType } from '@bx/shared';

import { getApiErrorMessage } from '@/shared/lib/getApiErrorMessage';
import { AdminDrawer } from '@/shared/ui/admin-drawer/AdminDrawer';
import { AppForm, useAppForm } from '@/shared/ui/admin-form';

import styles from '@/shared/ui/admin-form/AdminForm.module.css';

const FORM_ID = 'admin-user-form';

const userTypeOptions = [
  { value: 'ADMIN', label: '관리자' },
  { value: 'SERVICE', label: '서비스 사용자' },
];

const useYnOptions = [
  { value: 'Y', label: '사용' },
  { value: 'N', label: '중지' },
];

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
  const isEdit = usrId != null;
  const queryClient = useQueryClient();
  const [submitError, setSubmitError] = useState('');

  const { data: detail } = useQuery({
    ...userDetailQuery(usrId ?? ''),
    enabled: open && isEdit,
    retry: false,
  });
  const user = detail ?? fallback;

  const defaultValues = useMemo(() => toFormValues(user), [user]);
  const { form, FormInput, FormSelect } = useAppForm<UserFormValues>({ defaultValues });

  useEffect(() => {
    if (!open) return;
    setSubmitError('');
  }, [open]);

  const saveMutation = useMutation({
    mutationFn: (payload: UserPayload) =>
      isEdit ? updateUser(usrId, payload) : createUser(payload),
  });
  const deleteMutation = useMutation({ mutationFn: (id: string) => deleteUser(id) });
  const pending = saveMutation.isPending || deleteMutation.isPending;

  const handleSubmit = async (values: UserFormValues) => {
    setSubmitError('');
    const payload = toPayload(values);

    try {
      await saveMutation.mutateAsync(payload);
      await queryClient.invalidateQueries({ queryKey: userQueryKeys.all });
      onClose();
    } catch (error) {
      setSubmitError(getApiErrorMessage(error, '저장에 실패했습니다.'));
    }
  };

  const handleDelete = async () => {
    if (!isEdit) return;
    if (!window.confirm(`'${user?.usrNm ?? usrId}' 사용자를 삭제하시겠습니까?`)) return;

    setSubmitError('');
    try {
      await deleteMutation.mutateAsync(usrId);
      await queryClient.invalidateQueries({ queryKey: userQueryKeys.all });
      onClose();
    } catch (error) {
      setSubmitError(getApiErrorMessage(error, '삭제에 실패했습니다.'));
    }
  };

  return (
    <AdminDrawer
      open={open}
      title={isEdit ? user?.usrNm || '관리자 수정' : '관리자 등록'}
      subtitle={isEdit ? usrId : undefined}
      storageKey="admin-drawer:users"
      onClose={onClose}
      footer={
        <>
          {isEdit && (
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
            {saveMutation.isPending ? '저장 중' : '저장'}
          </button>
        </>
      }
    >
      <AppForm id={FORM_ID} form={form} onSubmit={handleSubmit}>
        <FormInput label="아이디" name="usrId" readOnly={isEdit} required />
        <FormSelect label="유형" name="userType" options={userTypeOptions} />
        <FormInput label="이름" name="usrNm" required />
        <FormSelect label="사용여부" name="useYn" options={useYnOptions} />
        <FormInput label="부서" name="deptName" />
        <FormInput label="직책" name="positDivName" />
        {submitError && <p className={styles.formError}>{submitError}</p>}
      </AppForm>
    </AdminDrawer>
  );
}
