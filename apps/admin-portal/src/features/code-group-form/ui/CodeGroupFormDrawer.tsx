import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

import {
  useCreateCommonCodeGroup,
  useDeleteCommonCodeGroup,
  useFetchCommonCodeGroup,
  useUpdateCommonCodeGroup,
} from '@bx/shared';
import type { CommonCodeGroup, CommonCodeGroupPayload } from '@bx/shared';

import { getApiErrorMessage } from '@/shared/lib/getApiErrorMessage';
import { AdminDrawer } from '@/shared/ui/admin-drawer/AdminDrawer';
import { AppForm, useAppForm } from '@/shared/ui/admin-form';

import styles from '@/shared/ui/admin-form/AdminForm.module.css';

const FORM_ID = 'admin-code-group-form';

interface CodeGroupFormValues {
  groupCd: string;
  groupNm: string;
  groupDesc: string;
  useYn: 'Y' | 'N';
}

const toFormValues = (group?: CommonCodeGroup): CodeGroupFormValues => ({
  groupCd: group?.groupCd ?? '',
  groupNm: group?.groupNm ?? '',
  groupDesc: group?.groupDesc ?? '',
  useYn: group?.useYn ?? 'Y',
});

const toPayload = (values: CodeGroupFormValues): CommonCodeGroupPayload => ({
  groupCd: values.groupCd.trim(),
  groupNm: values.groupNm.trim(),
  groupDesc: values.groupDesc.trim() || undefined,
  useYn: values.useYn,
});

const fullFieldClassName = `${styles.field} ${styles.fieldFull}`;

interface CodeGroupFormDrawerProps {
  open: boolean;
  /** 수정 대상 그룹코드. 없으면 등록 모드 */
  groupCd?: string;
  /** 목록 행 데이터 — 상세 응답이 오기 전이나 실패했을 때 초기값으로 사용 */
  fallback?: CommonCodeGroup;
  /** 폼 아래에 붙는 추가 콘텐츠 (예: 코드 목록 섹션) */
  children?: ReactNode;
  onClose: () => void;
}

export function CodeGroupFormDrawer({
  open,
  groupCd,
  fallback,
  children,
  onClose,
}: CodeGroupFormDrawerProps) {
  const isUpdateMode = groupCd != null;
  const [submitError, setSubmitError] = useState('');

  const { data: detailData } = useFetchCommonCodeGroup(groupCd ?? '', {
    enabled: open && isUpdateMode,
    retry: false,
  });
  const group = detailData?.[0] ?? fallback;

  const defaultValues = useMemo(() => toFormValues(group), [group]);
  const { form, FormInput, FormSelect, FormTextarea } = useAppForm<CodeGroupFormValues>({
    defaultValues,
  });

  useEffect(() => {
    if (!open) return;
    setSubmitError('');
  }, [open]);

  const createMutation = useCreateCommonCodeGroup();
  const updateMutation = useUpdateCommonCodeGroup();
  const deleteMutation = useDeleteCommonCodeGroup();
  const pending = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  const handleSubmit = async (values: CodeGroupFormValues) => {
    setSubmitError('');
    const payload = toPayload(values);

    try {
      if (isUpdateMode) {
        await updateMutation.mutateAsync({ groupCd, payload });
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
    if (!window.confirm(`'${group?.groupNm ?? groupCd}' 그룹을 삭제하시겠습니까?`)) return;

    setSubmitError('');
    try {
      await deleteMutation.mutateAsync(groupCd);
      onClose();
    } catch (error) {
      setSubmitError(getApiErrorMessage(error, '삭제에 실패했습니다.'));
    }
  };

  return (
    <AdminDrawer
      open={open}
      title={isUpdateMode ? group?.groupNm || '코드 그룹 수정' : '코드 그룹 등록'}
      subtitle={isUpdateMode ? groupCd : undefined}
      storageKey="admin-drawer:codes"
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
        <FormInput label="그룹코드" name="groupCd" readOnly={isUpdateMode} required />
        <FormSelect label="사용여부" name="useYn" groupCd="USE_YN" emptyOption="SELECT" />
        <FormInput label="그룹명" name="groupNm" required fieldClassName={fullFieldClassName} />
        <FormTextarea label="설명" name="groupDesc" fieldClassName={fullFieldClassName} />
        {submitError && <p className={styles.formError}>{submitError}</p>}
      </AppForm>
      {children}
    </AdminDrawer>
  );
}
