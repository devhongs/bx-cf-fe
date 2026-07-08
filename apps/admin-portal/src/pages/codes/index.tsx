import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

import { commonCodeGroupListQuery } from '@bx/shared';
import type { CommonCodeGroup } from '@bx/shared';

import type { AdminDataTableColumn } from '@/shared/ui/admin-data-table/AdminDataTable';
import { AdminDataTable } from '@/shared/ui/admin-data-table/AdminDataTable';
import { AdminDrawer } from '@/shared/ui/admin-drawer/AdminDrawer';
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

export function CodesPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');
  const { data } = useQuery({ ...commonCodeGroupListQuery(), retry: false });
  const groups = data?.length ? data : fallbackGroups;
  const [selectedGroupCd, setSelectedGroupCd] = useState(groups[0]?.groupCd);

  const filteredGroups = useMemo(() => {
    return groups.filter((group) => {
      const keyword = `${group.groupCd ?? ''} ${group.groupNm ?? ''}`.toLowerCase();
      const matchesSearch = keyword.includes(search.toLowerCase());
      const matchesStatus = status === 'ALL' || group.useYn === status;
      return matchesSearch && matchesStatus;
    });
  }, [groups, search, status]);

  const selected = groups.find((group) => group.groupCd === selectedGroupCd) || filteredGroups[0];

  const columns: Array<AdminDataTableColumn<CommonCodeGroup>> = [
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
            onPrimaryAction={() => setSelectedGroupCd(undefined)}
          />
          <AdminDataTable
            columns={columns}
            rows={filteredGroups}
            getRowId={(row) => row.groupCd || row.groupId || ''}
            selectedId={selected?.groupCd}
            onRowSelect={(row) => setSelectedGroupCd(row.groupCd)}
          />
        </div>

        <AdminDrawer
          open={Boolean(selected)}
          title={selected?.groupNm || '코드 그룹 등록'}
          subtitle={selected?.groupCd}
          onClose={() => setSelectedGroupCd(undefined)}
          footer={
            <>
              <button type="button" className={styles.dangerButton}>
                삭제
              </button>
              <button type="button" className={styles.button}>
                저장
              </button>
            </>
          }
        >
          <div className={styles.fieldGrid}>
            <label className={styles.field}>
              <span>그룹코드</span>
              <input value={selected?.groupCd || ''} readOnly />
            </label>
            <label className={styles.field}>
              <span>사용여부</span>
              <select value={selected?.useYn || 'Y'} disabled>
                <option value="Y">사용</option>
                <option value="N">미사용</option>
              </select>
            </label>
            <label className={`${styles.field} ${styles.fieldFull}`}>
              <span>그룹명</span>
              <input value={selected?.groupNm || ''} readOnly />
            </label>
            <label className={`${styles.field} ${styles.fieldFull}`}>
              <span>설명</span>
              <textarea value={selected?.groupDesc || ''} readOnly />
            </label>
          </div>
        </AdminDrawer>
      </div>
    </section>
  );
}
