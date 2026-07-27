import { useState } from 'react';

import {
  $codeUtils,
  DataTableBox,
  useDeleteCommonCodeGroup,
  useFetchCommonCodeGroupList,
} from '@bx/shared';
import type { CommonCodeGroup, DataTableColumn } from '@bx/shared';

import { CodeGroupFormDrawer } from '@/features/code-group-form/ui/CodeGroupFormDrawer';
import { deleteSelectedItems } from '@/shared/lib/deleteSelectedItems';
import { AdminFilterBar } from '@/shared/ui/admin-filter-bar/AdminFilterBar';

import styles from './index.module.css';

const getGroupRowId = (group: CommonCodeGroup) => group.groupCd || group.groupId || '';
const emptyFilters = { search: '', status: '' };

export function CodesPage() {
  const [draftFilters, setDraftFilters] = useState(emptyFilters);
  const [appliedFilters, setAppliedFilters] = useState(emptyFilters);
  const { data } = useFetchCommonCodeGroupList(undefined, { retry: false });
  const groups = data ?? [];
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedGroupCd, setSelectedGroupCd] = useState<string | undefined>();
  const deleteGroup = useDeleteCommonCodeGroup();

  const filteredGroups = groups.filter((group) => {
    const keyword = `${group.groupCd ?? ''} ${group.groupNm ?? ''}`.toLowerCase();
    const matchesSearch = keyword.includes(appliedFilters.search.toLowerCase());
    const matchesStatus = !appliedFilters.status || group.useYn === appliedFilters.status;
    return matchesSearch && matchesStatus;
  });

  const columns: Array<DataTableColumn<CommonCodeGroup>> = [
    {
      id: 'groupCd',
      header: '그룹코드',
      width: '150px',
      sortable: true,
      cell: (row) => row.groupCd,
    },
    { id: 'groupNm', header: '그룹명', sortable: true, cell: (row) => row.groupNm },
    {
      id: 'systemYn',
      header: '시스템',
      width: '96px',
      align: 'center',
      sortable: true,
      sortValue: (row) => row.systemYn ?? '',
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
      sortable: true,
      sortValue: (row) => row.useYn ?? '',
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

  const handleBulkDelete = async (
    selectedGroups: CommonCodeGroup[],
  ): Promise<CommonCodeGroup[]> => {
    // 개별 실패는 전역 에러 알럿(MutationCache.onError)이 처리한다.
    const deletableGroups = selectedGroups.filter(
      (group): group is CommonCodeGroup & { groupCd: string } => Boolean(group.groupCd),
    );
    const skippedGroups = selectedGroups.filter((group) => !group.groupCd);
    const { failed } = await deleteSelectedItems(deletableGroups, (group) =>
      deleteGroup.mutateAsync(group.groupCd),
    );
    return [...skippedGroups, ...failed];
  };

  const resetFilters = () => {
    setDraftFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
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
            searchValue={draftFilters.search}
            statusValue={draftFilters.status}
            searchPlaceholder="그룹코드, 그룹명 검색"
            onSearchChange={(search) => setDraftFilters((current) => ({ ...current, search }))}
            onStatusChange={(status) => setDraftFilters((current) => ({ ...current, status }))}
            onSearch={() => setAppliedFilters(draftFilters)}
            onReset={resetFilters}
          />
          <DataTableBox
            rows={filteredGroups}
            getRowId={getGroupRowId}
            onCreate={() => openGroupDrawer()}
            onDelete={handleBulkDelete}
          >
            <DataTableBox.Table
              columns={columns}
              selectedId={selectedGroupCd}
              onRowSelect={(row) => openGroupDrawer(row.groupCd)}
              pageSize={10}
            />
          </DataTableBox>
        </div>

        <CodeGroupFormDrawer open={drawerOpen} groupCd={selectedGroupCd} onClose={closeDrawer} />
      </div>
    </section>
  );
}
