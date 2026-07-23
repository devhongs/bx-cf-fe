import { useState } from 'react';

import { $codeUtils, DataTable, useFetchCommonCodeGroupList } from '@bx/shared';
import type { CommonCodeGroup, DataTableColumn } from '@bx/shared';

import { CodeGroupFormDrawer } from '@/features/code-group-form/ui/CodeGroupFormDrawer';
import { AdminFilterBar } from '@/shared/ui/admin-filter-bar/AdminFilterBar';

import styles from './index.module.css';

export function CodesPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const { data } = useFetchCommonCodeGroupList(undefined, { retry: false });
  const groups = data ?? [];
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedGroupCd, setSelectedGroupCd] = useState<string | undefined>();

  const filteredGroups = groups.filter((group) => {
    const keyword = `${group.groupCd ?? ''} ${group.groupNm ?? ''}`.toLowerCase();
    const matchesSearch = keyword.includes(search.toLowerCase());
    const matchesStatus = !status || group.useYn === status;
    return matchesSearch && matchesStatus;
  });

  const selected = groups.find((group) => group.groupCd === selectedGroupCd);

  const columns: Array<DataTableColumn<CommonCodeGroup>> = [
    { id: 'groupCd', header: '그룹코드', width: '150px', cell: (row) => row.groupCd },
    { id: 'groupNm', header: '그룹명', cell: (row) => row.groupNm },
    {
      id: 'systemYn',
      header: '시스템',
      width: '96px',
      align: 'center',
      cell: (row) => (
        <span className={`${styles.badge} ${row.systemYn === 'Y' ? styles.badgeWarning : ''}`}>
          {row.systemYn || 'N'}
        </span>
      ),
    },
    {
      id: 'useYn',
      header: '상태',
      width: '96px',
      align: 'center',
      cell: (row) => (
        <span className={`${styles.badge} ${row.useYn === 'Y' ? styles.badgeSuccess : ''}`}>
          {$codeUtils.codeValue('USE_YN', row.useYn ?? '', { visibleCode: false })}
        </span>
      ),
    },
  ];

  const openGroupDrawer = (groupCd?: string) => {
    setSelectedGroupCd(groupCd);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelectedGroupCd(undefined);
  };

  return (
    <section className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h2>코드관리</h2>
          <p>공통코드 그룹과 하위 코드를 조회하고 등록/수정/삭제합니다.</p>
        </div>
      </div>

      <div className={styles.workspace}>
        <div className={styles.listPane}>
          <AdminFilterBar
            searchValue={search}
            statusValue={status}
            resultLabel={`${filteredGroups.length}개 그룹`}
            primaryActionLabel="그룹 등록"
            searchPlaceholder="그룹코드, 그룹명 검색"
            onSearchChange={setSearch}
            onStatusChange={setStatus}
            onPrimaryAction={() => openGroupDrawer()}
          />
          <DataTable
            columns={columns}
            rows={filteredGroups}
            getRowId={(row) => row.groupCd || row.groupId || ''}
            selectedId={selected?.groupCd}
            onRowSelect={(row) => openGroupDrawer(row.groupCd)}
          />
        </div>

        <CodeGroupFormDrawer
          open={drawerOpen}
          groupCd={selectedGroupCd}
          fallback={selected}
          onClose={closeDrawer}
        />
      </div>
    </section>
  );
}
