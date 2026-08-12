import { openDeleteConfirm, Spinner } from '@bx/shared';

import styles from '@/shared/ui/admin-form/AdminForm.module.css';

interface AdminDrawerFormActionsProps {
  formId: string;
  pending: boolean;
  deletePending?: boolean;
  onDelete?: () => void | Promise<void>;
}

export function AdminDrawerFormActions({
  formId,
  pending,
  deletePending = false,
  onDelete,
}: AdminDrawerFormActionsProps) {
  const handleDelete = async () => {
    if (!onDelete || !(await openDeleteConfirm())) return;

    await onDelete();
  };

  return (
    <>
      {onDelete && (
        <button
          type="button"
          className={styles.dangerButton}
          disabled={pending || deletePending}
          onClick={() => void handleDelete()}
        >
          {deletePending ? '삭제 중' : '삭제'}
        </button>
      )}
      <button type="submit" form={formId} className={styles.button} disabled={pending}>
        {pending && <Spinner aria-hidden="true" data-icon="inline-start" />}
        {pending ? '처리 중' : '저장'}
      </button>
    </>
  );
}
