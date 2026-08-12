import type { Menu } from '@bx/shared';
import { useCreateMenu, useDeleteMenu, useUpdateMenu } from '@bx/shared';

import { AdminDrawer } from '@/shared/ui/admin-drawer/AdminDrawer';
import { AdminDrawerFormActions } from '@/shared/ui/admin-drawer/AdminDrawerFormActions';
import type { MenuFormPayload, MenuFormValues } from '../model/menu-form.type';
import { MenuForm } from './MenuForm';

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
  /** 수정 대상 메뉴. 없으면 등록 모드 */
  menu?: Menu;
  onClose: () => void;
}

export function MenuFormDrawer({ open, menu, onClose }: MenuFormDrawerProps) {
  const menuId = menu?.menuId;
  const isUpdateMode = menuId != null;

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

  const handleDelete = () => {
    if (!isUpdateMode) return;

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
        <AdminDrawerFormActions
          formId={FORM_ID}
          pending={pending}
          deletePending={deleteMutation.isPending}
          onDelete={isUpdateMode ? handleDelete : undefined}
        />
      }
    >
      <MenuForm id={FORM_ID} open={open} defaultValues={defaultValues} onSubmit={handleSubmit} />
    </AdminDrawer>
  );
}
