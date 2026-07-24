import {
  useCreateCommonCodeGroup,
  useDeleteCommonCodeGroup,
  useFetchCommonCodeGroup,
  useReplaceCommonCodes,
} from '@bx/shared';
import type { CommonCode, CommonCodeGroup, CommonCodeReplacePayload } from '@bx/shared';

import { AdminDrawer } from '@/shared/ui/admin-drawer/AdminDrawer';
import { AdminDrawerFormActions } from '@/shared/ui/admin-drawer/AdminDrawerFormActions';
import { AppForm, useAppForm } from '@/shared/ui/admin-form';
import type { CodeGroupFormValues } from '../model/code-group-form.type';
import { CodeListFields } from './CodeListFields';

import styles from '@/shared/ui/admin-form/AdminForm.module.css';

import codeStyles from './CodeGroupFormDrawer.module.css';

const FORM_ID = 'admin-code-group-form';

const toFormValues = (group?: CommonCodeGroup): CodeGroupFormValues => ({
  groupCd: group?.groupCd ?? '',
  groupNm: group?.groupNm ?? '',
  groupDesc: group?.groupDesc ?? '',
  useYn: group?.useYn ?? 'Y',
  codes: (group?.codes ?? []).map((code: CommonCode) => ({
    code: code.code ?? '',
    codeNm: code.codeNm ?? '',
    useYn: code.useYn ?? 'Y',
  })),
});

/**
 * 그룹 + 코드 일괄 저장 payload.
 */
type CodeGroupSavePayload = { groupCd: string } & CommonCodeReplacePayload;

const toPayload = (values: CodeGroupFormValues): CodeGroupSavePayload => ({
  groupCd: values.groupCd.trim(),
  groupNm: values.groupNm.trim(),
  groupDesc: values.groupDesc.trim() || undefined,
  useYn: values.useYn,
  codes: values.codes.map((row, index) => ({
    code: row.code.trim(),
    codeNm: row.codeNm.trim(),
    sortSeq: index + 1,
    useYn: row.useYn,
  })),
});

const fullFieldClassName = `${styles.field} ${styles.fieldFull}`;

interface CodeGroupFormDrawerProps {
  open: boolean;
  /** 수정 대상 그룹코드. 없으면 등록 모드 */
  groupCd?: string;
  onClose: () => void;
}

export function CodeGroupFormDrawer({ open, groupCd, onClose }: CodeGroupFormDrawerProps) {
  const isUpdateMode = groupCd != null;

  const detailQuery = useFetchCommonCodeGroup(groupCd ?? '', {
    enabled: open && isUpdateMode,
    retry: false,
  });
  const group = detailQuery.data;
  const isDetailLoading = isUpdateMode && detailQuery.isPending;
  const isDetailReady = !isUpdateMode || group != null;
  const isDetailEmpty = isUpdateMode && !isDetailLoading && group == null;

  const defaultValues = toFormValues(group);
  const { form, FormInput, FormSelect, FormTextarea } = useAppForm<CodeGroupFormValues>({
    open,
    defaultValues,
  });

  const createMutation = useCreateCommonCodeGroup();
  const replaceMutation = useReplaceCommonCodes();
  const deleteMutation = useDeleteCommonCodeGroup();
  const pending = createMutation.isPending || replaceMutation.isPending || deleteMutation.isPending;

  // 성공 시에만 닫는다. 실패는 공통 에러 알럿(MutationCache.onError)이 처리한다.
  const handleSubmit = (values: CodeGroupFormValues) => {
    const payload = toPayload(values);
    if (isUpdateMode) {
      replaceMutation.mutate({ groupCd, payload }, { onSuccess: onClose });
    } else {
      createMutation.mutate(payload, { onSuccess: onClose });
    }
  };

  const handleDelete = () => {
    if (!isUpdateMode) return;

    deleteMutation.mutate(groupCd, { onSuccess: onClose });
  };

  return (
    <AdminDrawer
      open={open}
      title={isUpdateMode ? group?.groupNm || '코드 그룹 수정' : '코드 그룹 등록'}
      subtitle={isUpdateMode ? groupCd : undefined}
      storageKey="admin-drawer:codes"
      onClose={onClose}
      footer={
        isDetailReady ? (
          <AdminDrawerFormActions
            formId={FORM_ID}
            pending={pending}
            deletePending={deleteMutation.isPending}
            onDelete={isUpdateMode ? handleDelete : undefined}
          />
        ) : undefined
      }
    >
      {isDetailLoading && (
        <div className={codeStyles.detailState}>
          <p>코드 그룹 정보를 불러오는 중입니다.</p>
        </div>
      )}
      {isDetailEmpty && (
        <div className={codeStyles.detailState}>
          <p>코드 그룹 정보가 없습니다.</p>
        </div>
      )}
      {isDetailReady && (
        <AppForm id={FORM_ID} form={form} onSubmit={handleSubmit}>
          <FormInput label="그룹코드" name="groupCd" readOnly={isUpdateMode} required />
          <FormSelect label="사용여부" name="useYn" groupCd="USE_YN" emptyOption="SELECT" />
          <FormInput label="그룹명" name="groupNm" required fieldClassName={fullFieldClassName} />
          <FormTextarea label="설명" name="groupDesc" fieldClassName={fullFieldClassName} />

          <CodeListFields control={form.control} />
        </AppForm>
      )}
    </AdminDrawer>
  );
}
