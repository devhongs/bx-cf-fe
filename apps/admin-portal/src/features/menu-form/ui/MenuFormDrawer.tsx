import { openConfirm, useCreateMenu, useDeleteMenu, useFetchMenu, useUpdateMenu } from '@bx/shared';
import type { Menu } from '@bx/shared';

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

  const { data: detail } = useFetchMenu(menuId ?? -1, {
    enabled: open && isUpdateMode,
    retry: false,
  });
  const menu = detail ?? fallback;

  const defaultValues = toFormValues(menu);

  const createMutation = useCreateMenu();
  const updateMutation = useUpdateMenu();
  const deleteMutation = useDeleteMenu();
  const pending = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  // 성공 시에만 닫는다. 실패는 공통 에러 알럿(MutationCache.onError)이 처리한다.
  const handleSubmit = (payload: MenuFormPayload) => {
    if (isUpdateMode) {
      updateMutation.mutate({ menuId, payload }, { onSuccess: onClose });
    } else {
      createMutation.mutate(payload, { onSuccess: onClose });
    }
  };

  const handleDelete = async () => {
    if (!isUpdateMode) return;

    const confirmed = await openConfirm({
      message: `'${menu?.menuNm ?? menuId}' 메뉴를 삭제하시겠습니까?`,
    });
    if (!confirmed) return;

    deleteMutation.mutate(menuId, { onSuccess: onClose });
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
      <MenuForm id={FORM_ID} open={open} defaultValues={defaultValues} onSubmit={handleSubmit} />
    </AdminDrawer>
  );
}
