import { useMemo, useState } from 'react';

import { DataTable, useFetchCommonCodeGroupList, useFetchCommonCodeList } from '@bx/shared';
import type { CommonCode, CommonCodeGroup, DataTableColumn } from '@bx/shared';

import { CodeGroupFormDrawer } from '@/features/code-group-form/ui/CodeGroupFormDrawer';
import { AdminFilterBar } from '@/shared/ui/admin-filter-bar/AdminFilterBar';

import styles from '../admin-page.module.css';

const fallbackGroups: CommonCodeGroup[] = [
  {
    groupId: 1,
    groupCd: 'USE_YN',
    groupNm: '사용 여부',
    groupDesc: '사용/미사용 상태 공통 코드',
    systemYn: 'Y',
    useYn: 'Y',
  },
  {
    groupId: 2,
    groupCd: 'USER_TYPE',
    groupNm: '사용자 유형',
    groupDesc: '관리자와 서비스 사용자 구분',
    systemYn: 'N',
    useYn: 'Y',
  },
  {
    groupId: 3,
    groupCd: 'MENU_TYPE',
    groupNm: '메뉴 유형',
    groupDesc: '메뉴, 화면, 링크 구분',
    systemYn: 'N',
    useYn: 'Y',
  },
];

const fallbackCodesByGroup: Record<string, CommonCode[]> = {
  USE_YN: [
    { groupCd: 'USE_YN', code: 'Y', codeNm: '사용', sortSeq: 1, useYn: 'Y' },
    { groupCd: 'USE_YN', code: 'N', codeNm: '미사용', sortSeq: 2, useYn: 'Y' },
  ],
  USER_TYPE: [
    { groupCd: 'USER_TYPE', code: 'ADMIN', codeNm: '관리자', sortSeq: 1, useYn: 'Y' },
    { groupCd: 'USER_TYPE', code: 'SERVICE', codeNm: '서비스 사용자', sortSeq: 2, useYn: 'Y' },
  ],
  MENU_TYPE: [
    { groupCd: 'MENU_TYPE', code: 'MENU', codeNm: '메뉴', sortSeq: 1, useYn: 'Y' },
    { groupCd: 'MENU_TYPE', code: 'PAGE', codeNm: '화면', sortSeq: 2, useYn: 'Y' },
  ],
};

export function CodesPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');
  const { data } = useFetchCommonCodeGroupList(undefined, { retry: false });
  const groups = data?.length ? data : fallbackGroups;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedGroupCd, setSelectedGroupCd] = useState<string | undefined>();

  const filteredGroups = useMemo(() => {
    return groups.filter((group) => {
      const keyword = `${group.groupCd ?? ''} ${group.groupNm ?? ''}`.toLowerCase();
      const matchesSearch = keyword.includes(search.toLowerCase());
      const matchesStatus = status === 'ALL' || group.useYn === status;
      return matchesSearch && matchesStatus;
    });
  }, [groups, search, status]);

  const selected = groups.find((group) => group.groupCd === selectedGroupCd);
  const selectedGroupCdForQuery = selected?.groupCd || '';
  const { data: codeData } = useFetchCommonCodeList(selectedGroupCdForQuery, undefined, {
    enabled: drawerOpen && Boolean(selectedGroupCdForQuery),
    retry: false,
  });
  const selectedCodes = selectedGroupCdForQuery
    ? codeData?.length
      ? codeData
      : (fallbackCodesByGroup[selectedGroupCdForQuery] ?? [])
    : [];

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
          {row.useYn === 'Y' ? '사용' : '미사용'}
        </span>
      ),
    },
  ];

  const codeColumns: Array<DataTableColumn<CommonCode>> = [
    { id: 'code', header: '코드', width: '132px', cell: (row) => row.code },
    { id: 'codeNm', header: '코드명', cell: (row) => row.codeNm },
    { id: 'sortSeq', header: '정렬', width: '72px', align: 'right', cell: (row) => row.sortSeq },
    {
      id: 'useYn',
      header: '상태',
      width: '86px',
      align: 'center',
      cell: (row) => (
        <span className={`${styles.badge} ${row.useYn === 'Y' ? styles.badgeSuccess : ''}`}>
          {row.useYn === 'Y' ? '사용' : '미사용'}
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
        >
          {selected && (
            <section className={styles.detailBlock}>
              <div className={styles.detailBlockHeader}>
                <h3>코드 목록</h3>
                <button type="button" className={styles.ghostButton}>
                  코드 추가
                </button>
              </div>
              <DataTable
                columns={codeColumns}
                rows={selectedCodes}
                getRowId={(row) => row.code || row.sortSeq || ''}
                emptyLabel="등록된 코드가 없습니다."
              />
            </section>
          )}
        </CodeGroupFormDrawer>
      </div>
    </section>
  );
}
