import { useMemo, useState } from 'react';

import { $codeUtils, DataTable, useFetchMenuList } from '@bx/shared';
import type { DataTableColumn, Menu } from '@bx/shared';

import { MenuFormDrawer } from '@/features/menu-form/ui/MenuFormDrawer';
import { AdminFilterBar } from '@/shared/ui/admin-filter-bar/AdminFilterBar';

import styles from '../admin-page.module.css';

export function MenusPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const { data } = useFetchMenuList(undefined, { retry: false });
  const menus = data ?? [];
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedMenuId, setSelectedMenuId] = useState<number | undefined>();

  const filteredMenus = useMemo(() => {
    return menus.filter((menu) => {
      const keyword = `${menu.menuCd ?? ''} ${menu.menuNm ?? ''} ${menu.path ?? ''}`.toLowerCase();
      const matchesSearch = keyword.includes(search.toLowerCase());
      const matchesStatus = !status || menu.useYn === status;
      return matchesSearch && matchesStatus;
    });
  }, [menus, search, status]);

  const selected = menus.find((menu) => menu.menuId === selectedMenuId);

  const columns: Array<DataTableColumn<Menu>> = [
    { id: 'menuCd', header: '메뉴코드', width: '150px', cell: (row) => row.menuCd },
    { id: 'menuNm', header: '메뉴명', cell: (row) => row.menuNm },
    { id: 'path', header: '경로', cell: (row) => row.path },
    { id: 'sortSeq', header: '정렬', width: '80px', align: 'right', cell: (row) => row.sortSeq },
    {
      id: 'visibleYn',
      header: '노출',
      width: '88px',
      align: 'center',
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
            searchValue={search}
            statusValue={status}
            resultLabel={`${filteredMenus.length}개 메뉴`}
            primaryActionLabel="메뉴 등록"
            searchPlaceholder="메뉴코드, 메뉴명, 경로 검색"
            onSearchChange={setSearch}
            onStatusChange={setStatus}
            onPrimaryAction={() => openMenuDrawer()}
          />
          <DataTable
            columns={columns}
            rows={filteredMenus}
            getRowId={(row) => row.menuId ?? row.menuCd ?? ''}
            selectedId={selected?.menuId}
            onRowSelect={(row) => openMenuDrawer(row.menuId)}
          />
        </div>

        <MenuFormDrawer
          open={drawerOpen}
          menuId={selectedMenuId}
          fallback={selected}
          onClose={closeDrawer}
        />
      </div>
    </section>
  );
}
