import { Plus, Trash2 } from 'lucide-react';

import { Button, FormInput, FormSelect, useFieldArray } from '@bx/shared';
import type { UseBaseFormReturn } from '@bx/shared';

import type { CodeGroupFormValues } from '../model/code-group-form.type';

import adminStyles from '@/shared/ui/admin-form/AdminForm.module.css';
import styles from './CodeListFields.module.css';

const cellFieldClassName = `${adminStyles.field} ${styles.cell}`;

interface CodeListFieldsProps {
  control: UseBaseFormReturn<CodeGroupFormValues>['form']['control'];
}

export function CodeListFields({ control }: CodeListFieldsProps) {
  const { fields, append, remove } = useFieldArray({ control, name: 'codes' });

  return (
    <section className={`${styles.section} ${adminStyles.fieldFull}`}>
      <div className={styles.header}>
        <h3>코드 목록</h3>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className={styles.addButton}
          onClick={() => append({ code: '', codeNm: '', useYn: 'Y' })}
        >
          <Plus aria-hidden="true" />
          코드 추가
        </Button>
      </div>

      {fields.length === 0 ? (
        <p className={styles.empty}>등록된 코드가 없습니다.</p>
      ) : (
        <>
          <div className={styles.columnHeader}>
            <span>정렬</span>
            <span>코드</span>
            <span>코드명</span>
            <span>사용여부</span>
            <span />
          </div>
          <div className={styles.rows}>
            {fields.map((field, index) => (
              <div key={field.id} className={styles.row}>
                <span className={styles.sortSeq}>{index + 1}</span>
                <FormInput<CodeGroupFormValues>
                  name={`codes.${index}.code`}
                  required
                  fieldClassName={cellFieldClassName}
                  deps={['codes']}
                  validate={(value, values) =>
                    values.codes.filter((row) => row.code.trim() === String(value).trim())
                      .length === 1 || '코드가 중복됩니다.'
                  }
                />
                <FormInput<CodeGroupFormValues>
                  name={`codes.${index}.codeNm`}
                  required
                  fieldClassName={cellFieldClassName}
                />
                <FormSelect<CodeGroupFormValues>
                  name={`codes.${index}.useYn`}
                  groupCd="USE_YN"
                  emptyOption="NONE"
                  fieldClassName={cellFieldClassName}
                />
                <button
                  type="button"
                  className={styles.removeButton}
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
  );
}
