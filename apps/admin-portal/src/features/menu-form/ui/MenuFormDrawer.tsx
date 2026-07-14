import { useEffect, useMemo, useState } from 'react';

import { useCreateMenu, useDeleteMenu, useFetchMenu, useUpdateMenu } from '@bx/shared';
import type { Menu } from '@bx/shared';

import { getApiErrorMessage } from '@/shared/lib/getApiErrorMessage';
import { AdminDrawer } from '@/shared/ui/admin-drawer/AdminDrawer';
import type { MenuFormPayload, MenuFormValues } from '../model/menu-form.type';
import { MenuForm } from './MenuForm';

import styles from '@/shared/ui/admin-form/AdminForm.module.css';

const FORM_ID = 'admin-menu-form';

const toFormValues = (menu?: Menu): MenuFormValues => ({
  menuCd: menu?.menuCd ?? '',
  menuNm: menu?.menuNm ?? '',
  menuType: menu?.menuType ?? 'MENU',
  path: menu?.path ?? '',
  sortSeq: menu?.sortSeq != null ? String(menu.sortSeq) : '',
  visibleYn: menu?.visibleYn ?? 'Y',
});

interface MenuFormDrawerProps {
  open: boolean;
  /** 수정 대상 메뉴 id. 없으면 등록 모드 */
  menuId?: number;
  /** 목록 행 데이터 — 상세 응답이 오기 전이나 실패했을 때 초기값으로 사용 */
  fallback?: Menu;
  onClose: () => void;
}

export function MenuFormDrawer({ open, menuId, fallback, onClose }: MenuFormDrawerProps) {
  const isUpdateMode = menuId != null;
  const [submitError, setSubmitError] = useState('');

  const { data: detail } = useFetchMenu(menuId ?? -1, {
    enabled: open && isUpdateMode,
    retry: false,
  });
  const menu = detail ?? fallback;

  const defaultValues = useMemo(() => toFormValues(menu), [menu]);

  useEffect(() => {
    if (!open) return;
    setSubmitError('');
  }, [open]);

  const createMutation = useCreateMenu();
  const updateMutation = useUpdateMenu();
  const deleteMutation = useDeleteMenu();
  const pending = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  const handleSubmit = async (payload: MenuFormPayload) => {
    setSubmitError('');

    try {
      if (isUpdateMode) {
        await updateMutation.mutateAsync({ menuId, payload });
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
    if (!window.confirm(`'${menu?.menuNm ?? menuId}' 메뉴를 삭제하시겠습니까?`)) return;

    setSubmitError('');
    try {
      await deleteMutation.mutateAsync(menuId);
      onClose();
    } catch (error) {
      setSubmitError(getApiErrorMessage(error, '삭제에 실패했습니다.'));
    }
  };

  return (
    <AdminDrawer
      open={open}
      title={isUpdateMode ? menu?.menuNm || '메뉴 수정' : '메뉴 등록'}
      subtitle={isUpdateMode ? menu?.path : undefined}
      storageKey="admin-drawer:menus"
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
      <MenuForm
        id={FORM_ID}
        defaultValues={defaultValues}
        submitError={submitError}
        onSubmit={handleSubmit}
      />
    </AdminDrawer>
  );
}
