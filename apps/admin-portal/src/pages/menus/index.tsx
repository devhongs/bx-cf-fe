import { useState } from 'react';

import { $codeUtils, DataTableBox, useDeleteMenu, useFetchMenuList } from '@bx/shared';
import type { DataTableColumn, Menu } from '@bx/shared';

import { MenuFormDrawer } from '@/features/menu-form/ui/MenuFormDrawer';
import { deleteSelectedItems } from '@/shared/lib/deleteSelectedItems';
import { AdminFilterBar } from '@/shared/ui/admin-filter-bar/AdminFilterBar';

import styles from './index.module.css';

const getMenuRowId = (menu: Menu) => menu.menuId ?? menu.menuCd ?? '';
const emptyFilters = { search: '', status: '' };

export function MenusPage() {
  const [draftFilters, setDraftFilters] = useState(emptyFilters);
  const [appliedFilters, setAppliedFilters] = useState(emptyFilters);
  const { data } = useFetchMenuList(undefined, { retry: false });
  const menus = data ?? [];
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedMenuId, setSelectedMenuId] = useState<number | undefined>();
  const deleteMenu = useDeleteMenu();

  const filteredMenus = menus.filter((menu) => {
    const keyword = `${menu.menuCd ?? ''} ${menu.menuNm ?? ''} ${menu.path ?? ''}`.toLowerCase();
    const matchesSearch = keyword.includes(appliedFilters.search.toLowerCase());
    const matchesStatus = !appliedFilters.status || menu.useYn === appliedFilters.status;
    return matchesSearch && matchesStatus;
  });

  const selected = menus.find((menu) => menu.menuId === selectedMenuId);

  const columns: Array<DataTableColumn<Menu>> = [
    { id: 'menuCd', header: '메뉴코드', width: '150px', sortable: true, cell: (row) => row.menuCd },
    { id: 'menuNm', header: '메뉴명', sortable: true, cell: (row) => row.menuNm },
    { id: 'path', header: '경로', sortable: true, cell: (row) => row.path },
    {
      id: 'sortSeq',
      header: '정렬',
      width: '80px',
      align: 'right',
      sortable: true,
      sortValue: (row) => row.sortSeq ?? 0,
      cell: (row) => row.sortSeq,
    },
    {
      id: 'visibleYn',
      header: '노출',
      width: '88px',
      align: 'center',
      sortable: true,
      sortValue: (row) => row.visibleYn ?? '',
      cell: (row) => (
        <span className={`${styles.badge} ${row.visibleYn === 'Y' ? styles.badgeSuccess : ''}`}>
          {$codeUtils.codeValue('VISIBLE_YN', row.visibleYn ?? '', { visibleCode: false })}
        </span>
      ),
    },
  ];

  const openMenuDrawer = (menuId?: number) => {
    setSelectedMenuId(menuId);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelectedMenuId(undefined);
  };

  const handleBulkDelete = async (selectedMenus: Menu[]): Promise<Menu[]> => {
    // 개별 실패는 전역 에러 알럿(MutationCache.onError)이 처리한다.
    const deletableMenus = selectedMenus.filter(
      (menu): menu is Menu & { menuId: number } => menu.menuId != null,
    );
    const skippedMenus = selectedMenus.filter((menu) => menu.menuId == null);
    const { failed } = await deleteSelectedItems(deletableMenus, (menu) =>
      deleteMenu.mutateAsync(menu.menuId),
    );
    return [...skippedMenus, ...failed];
  };

  const resetFilters = () => {
    setDraftFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
  };

  return (
    <section className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h2>메뉴관리</h2>
          <p>라우팅은 이미 존재하는 화면 경로를 기준으로 관리합니다.</p>
        </div>
      </div>

      <div className={styles.workspace}>
        <div className={styles.listPane}>
          <AdminFilterBar
            searchValue={draftFilters.search}
            statusValue={draftFilters.status}
            searchPlaceholder="메뉴코드, 메뉴명, 경로 검색"
            onSearchChange={(search) => setDraftFilters((current) => ({ ...current, search }))}
            onStatusChange={(status) => setDraftFilters((current) => ({ ...current, status }))}
            onSearch={() => setAppliedFilters(draftFilters)}
            onReset={resetFilters}
          />
          <DataTableBox
            rows={filteredMenus}
            getRowId={getMenuRowId}
            onCreate={() => openMenuDrawer()}
            onDelete={handleBulkDelete}
          >
            <DataTableBox.Table
              columns={columns}
              selectedId={selected?.menuId}
              onRowSelect={(row) => openMenuDrawer(row.menuId)}
              pageSize={10}
            />
          </DataTableBox>
        </div>

        <MenuFormDrawer open={drawerOpen} menu={selected} onClose={closeDrawer} />
      </div>
    </section>
  );
}
