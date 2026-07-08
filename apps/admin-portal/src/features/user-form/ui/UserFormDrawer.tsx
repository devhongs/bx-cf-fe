import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { Form, createUser, deleteUser, updateUser, useAppForm, userDetailQuery, userQueryKeys } from '@bx/shared';
import type { ManagedUser, UserPayload, UserType, UseYn } from '@bx/shared';

import { getApiErrorMessage } from '@/shared/lib/getApiErrorMessage';
import { AdminDrawer } from '@/shared/ui/admin-drawer/AdminDrawer';

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

  const { form } = useAppForm<UserFormValues>({ defaultValues: toFormValues(user) });

  useEffect(() => {
    if (!open) return;
    form.reset(toFormValues(user));
    setSubmitError('');
  }, [open, user, form]);

  const saveMutation = useMutation({
    mutationFn: (payload: UserPayload) =>
      isEdit ? updateUser(usrId, payload) : createUser(payload),
  });
  const deleteMutation = useMutation({ mutationFn: (id: string) => deleteUser(id) });
  const pending = saveMutation.isPending || deleteMutation.isPending;

  const handleSubmit = async (values: UserFormValues) => {
    setSubmitError('');
    const payload: UserPayload = {
      usrId: values.usrId.trim(),
      usrNm: values.usrNm.trim(),
      userType: values.userType,
      useYn: values.useYn,
      deptName: values.deptName.trim() || undefined,
      positDivName: values.positDivName.trim() || undefined,
    };

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
      <Form id={FORM_ID} form={form} className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.field}>
          <span>아이디</span>
          <input {...form.register('usrId', { required: true })} readOnly={isEdit} />
          {form.formState.errors.usrId && (
            <em className={styles.fieldError}>아이디를 입력하세요.</em>
          )}
        </label>
        <label className={styles.field}>
          <span>유형</span>
          <select {...form.register('userType')}>
            <option value="ADMIN">관리자</option>
            <option value="SERVICE">서비스 사용자</option>
          </select>
        </label>
        <label className={styles.field}>
          <span>이름</span>
          <input {...form.register('usrNm', { required: true })} />
          {form.formState.errors.usrNm && (
            <em className={styles.fieldError}>이름을 입력하세요.</em>
          )}
        </label>
        <label className={styles.field}>
          <span>사용여부</span>
          <select {...form.register('useYn')}>
            <option value="Y">사용</option>
            <option value="N">중지</option>
          </select>
        </label>
        <label className={styles.field}>
          <span>부서</span>
          <input {...form.register('deptName')} />
        </label>
        <label className={styles.field}>
          <span>직책</span>
          <input {...form.register('positDivName')} />
        </label>
        {submitError && <p className={styles.formError}>{submitError}</p>}
      </Form>
    </AdminDrawer>
  );
}
