import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

import {
  commonCodeGroupDetailQuery,
  commonCodeQueryKeys,
  createCommonCodeGroup,
  deleteCommonCodeGroup,
  updateCommonCodeGroup,
} from '@bx/shared';
import type { CommonCodeGroup, CommonCodeGroupPayload } from '@bx/shared';

import { getApiErrorMessage } from '@/shared/lib/getApiErrorMessage';
import { AdminDrawer } from '@/shared/ui/admin-drawer/AdminDrawer';
import { AppForm, useAppForm } from '@/shared/ui/admin-form';

import styles from '@/shared/ui/admin-form/AdminForm.module.css';

const FORM_ID = 'admin-code-group-form';

const useYnOptions = [
  { value: 'Y', label: '사용' },
  { value: 'N', label: '미사용' },
];

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
  const isEdit = groupCd != null;
  const queryClient = useQueryClient();
  const [submitError, setSubmitError] = useState('');

  const { data: detailData } = useQuery({
    ...commonCodeGroupDetailQuery(groupCd ?? ''),
    enabled: open && isEdit,
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

  const saveMutation = useMutation({
    mutationFn: (payload: CommonCodeGroupPayload) =>
      isEdit ? updateCommonCodeGroup(groupCd, payload) : createCommonCodeGroup(payload),
  });
  const deleteMutation = useMutation({
    mutationFn: (cd: string) => deleteCommonCodeGroup(cd),
  });
  const pending = saveMutation.isPending || deleteMutation.isPending;

  const handleSubmit = async (values: CodeGroupFormValues) => {
    setSubmitError('');
    const payload = toPayload(values);

    try {
      await saveMutation.mutateAsync(payload);
      await queryClient.invalidateQueries({ queryKey: commonCodeQueryKeys.all });
      onClose();
    } catch (error) {
      setSubmitError(getApiErrorMessage(error, '저장에 실패했습니다.'));
    }
  };

  const handleDelete = async () => {
    if (!isEdit) return;
    if (!window.confirm(`'${group?.groupNm ?? groupCd}' 그룹을 삭제하시겠습니까?`)) return;

    setSubmitError('');
    try {
      await deleteMutation.mutateAsync(groupCd);
      await queryClient.invalidateQueries({ queryKey: commonCodeQueryKeys.all });
      onClose();
    } catch (error) {
      setSubmitError(getApiErrorMessage(error, '삭제에 실패했습니다.'));
    }
  };

  return (
    <AdminDrawer
      open={open}
      title={isEdit ? group?.groupNm || '코드 그룹 수정' : '코드 그룹 등록'}
      subtitle={isEdit ? groupCd : undefined}
      storageKey="admin-drawer:codes"
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
        <FormInput label="그룹코드" name="groupCd" readOnly={isEdit} required />
        <FormSelect label="사용여부" name="useYn" options={useYnOptions} />
        <FormInput label="그룹명" name="groupNm" required fieldClassName={fullFieldClassName} />
        <FormTextarea label="설명" name="groupDesc" fieldClassName={fullFieldClassName} />
        {submitError && <p className={styles.formError}>{submitError}</p>}
      </AppForm>
      {children}
    </AdminDrawer>
  );
}
