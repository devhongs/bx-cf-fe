import { Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

import {
  Button,
  openConfirm,
  useCreateCommonCodeGroup,
  useDeleteCommonCodeGroup,
  useFetchCommonCodeGroup,
  useFetchCommonCodeList,
  useFieldArray,
  useReplaceCommonCodes,
} from '@bx/shared';
import type { CommonCode, CommonCodeGroup, CommonCodeReplacePayload } from '@bx/shared';

import { getApiErrorMessage } from '@/shared/lib/getApiErrorMessage';
import { AdminDrawer } from '@/shared/ui/admin-drawer/AdminDrawer';
import { AppForm, useAppForm } from '@/shared/ui/admin-form';

import styles from '@/shared/ui/admin-form/AdminForm.module.css';

import codeStyles from './CodeGroupFormDrawer.module.css';

const FORM_ID = 'admin-code-group-form';

/**
 * 폼이 들고 있는 코드 행. sortSeq는 배열 순서로 확정하므로 입력받지 않는다.
 *
 * 저장이 그룹 단위 전체 교체(서버가 기존 코드를 전부 지우고 payload로 다시 삽입)라
 * 기존 행의 `codeId`는 보낼 필요가 없다. 화면에서 지운 행은 payload에서 빠지는 것으로 삭제된다.
 */
interface CodeRowValues {
  code: string;
  codeNm: string;
  useYn: 'Y' | 'N';
}

interface CodeGroupFormValues {
  groupCd: string;
  groupNm: string;
  groupDesc: string;
  useYn: 'Y' | 'N';
  codes: CodeRowValues[];
}

const toCodeRow = (code: CommonCode): CodeRowValues => ({
  code: code.code ?? '',
  codeNm: code.codeNm ?? '',
  useYn: code.useYn ?? 'Y',
});

const toFormValues = (group?: CommonCodeGroup, codes: CommonCode[] = []): CodeGroupFormValues => ({
  groupCd: group?.groupCd ?? '',
  groupNm: group?.groupNm ?? '',
  groupDesc: group?.groupDesc ?? '',
  useYn: group?.useYn ?? 'Y',
  codes: codes.map(toCodeRow),
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
/* 행 안의 필드도 admin 입력 스타일(.field input)을 그대로 받아야 하므로 함께 건다 */
const cellFieldClassName = `${styles.field} ${codeStyles.cell}`;

interface CodeGroupFormDrawerProps {
  open: boolean;
  /** 수정 대상 그룹코드. 없으면 등록 모드 */
  groupCd?: string;
  /** 목록 행 데이터 — 상세 응답이 오기 전이나 실패했을 때 초기값으로 사용 */
  fallback?: CommonCodeGroup;
  onClose: () => void;
}

export function CodeGroupFormDrawer({
  open,
  groupCd,
  fallback,
  onClose,
}: CodeGroupFormDrawerProps) {
  const isUpdateMode = groupCd != null;
  const [submitError, setSubmitError] = useState('');

  const { data: detailData } = useFetchCommonCodeGroup(groupCd ?? '', {
    enabled: open && isUpdateMode,
    retry: false,
  });
  const group = detailData?.[0] ?? fallback;

  const { data: codeData } = useFetchCommonCodeList(groupCd ?? '', undefined, {
    enabled: open && isUpdateMode,
    retry: false,
  });
  const defaultValues = toFormValues(group, codeData ?? []);
  const { form, FormInput, FormSelect, FormTextarea } = useAppForm<CodeGroupFormValues>({
    open,
    defaultValues,
  });
  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'codes' });

  useEffect(() => {
    if (!open) return;
    setSubmitError('');
  }, [open]);

  const createMutation = useCreateCommonCodeGroup();
  const replaceMutation = useReplaceCommonCodes();
  const deleteMutation = useDeleteCommonCodeGroup();
  const pending = createMutation.isPending || replaceMutation.isPending || deleteMutation.isPending;

  const handleSubmit = async (values: CodeGroupFormValues) => {
    setSubmitError('');
    const payload = toPayload(values);

    try {
      if (isUpdateMode) {
        await replaceMutation.mutateAsync({ groupCd, payload });
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
      message: `'${group?.groupNm ?? groupCd}' 그룹을 삭제하시겠습니까?`,
    });
    if (!confirmed) return;

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

        <section className={`${codeStyles.section} ${styles.fieldFull}`}>
          <div className={codeStyles.header}>
            <h3>코드 목록</h3>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className={codeStyles.addButton}
              onClick={() => append({ code: '', codeNm: '', useYn: 'Y' })}
            >
              <Plus aria-hidden="true" />
              코드 추가
            </Button>
          </div>

          {fields.length === 0 ? (
            <p className={codeStyles.empty}>등록된 코드가 없습니다.</p>
          ) : (
            <>
              <div className={codeStyles.columnHeader}>
                <span>정렬</span>
                <span>코드</span>
                <span>코드명</span>
                <span>사용여부</span>
                <span />
              </div>
              <div className={codeStyles.rows}>
                {fields.map((field, index) => (
                  <div key={field.id} className={codeStyles.row}>
                    {/* 정렬 순서는 배열 순서로 확정한다 (저장 시 index + 1) */}
                    <span className={codeStyles.sortSeq}>{index + 1}</span>
                    <FormInput
                      name={`codes.${index}.code`}
                      required
                      fieldClassName={cellFieldClassName}
                      /* 한 행을 고치면 짝이 된 다른 행의 중복 에러도 같이 풀려야 한다 */
                      deps={['codes']}
                      validate={(value, values) =>
                        values.codes.filter((row) => row.code.trim() === String(value).trim())
                          .length === 1 || '코드가 중복됩니다.'
                      }
                    />
                    <FormInput
                      name={`codes.${index}.codeNm`}
                      required
                      fieldClassName={cellFieldClassName}
                    />
                    <FormSelect
                      name={`codes.${index}.useYn`}
                      groupCd="USE_YN"
                      emptyOption="NONE"
                      fieldClassName={cellFieldClassName}
                    />
                    <button
                      type="button"
                      className={codeStyles.removeButton}
                      aria-label={`${index + 1}번째 코드 삭제`}
                      onClick={() => remove(index)}
                    >
                      <Trash2 aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>

        {submitError && <p className={styles.formError}>{submitError}</p>}
      </AppForm>
    </AdminDrawer>
  );
}
