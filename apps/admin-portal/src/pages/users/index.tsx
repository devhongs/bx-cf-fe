import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

import { userListQuery } from '@bx/shared';
import type { ManagedUser } from '@bx/shared';

import type { AdminDataTableColumn } from '@/shared/ui/admin-data-table/AdminDataTable';
import { AdminDataTable } from '@/shared/ui/admin-data-table/AdminDataTable';
import { AdminDrawer } from '@/shared/ui/admin-drawer/AdminDrawer';
import { AdminFilterBar } from '@/shared/ui/admin-filter-bar/AdminFilterBar';

import styles from '../admin-page.module.css';

const fallbackUsers: ManagedUser[] = [
  {
    usrId: 'admin',
    usrNm: '관리자',
    userType: 'ADMIN',
    deptName: '운영',
    positDivName: '슈퍼관리자',
    useYn: 'Y',
  },
  {
    usrId: 'ops01',
    usrNm: '운영자',
    userType: 'ADMIN',
    deptName: '서비스운영',
    positDivName: '운영자',
    useYn: 'Y',
  },
  {
    usrId: 'svc-user',
    usrNm: '서비스 사용자',
    userType: 'SERVICE',
    deptName: '고객',
    positDivName: '일반',
    useYn: 'Y',
  },
];

export function UsersPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');
  const [userType, setUserType] = useState('ALL');
  const { data } = useQuery({ ...userListQuery(), retry: false });
  const users = data?.length ? data : fallbackUsers;
  const [selectedUsrId, setSelectedUsrId] = useState<string | undefined>(users[0]?.usrId);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const keyword = `${user.usrId} ${user.usrNm} ${user.deptName ?? ''}`.toLowerCase();
      const matchesSearch = keyword.includes(search.toLowerCase());
      const matchesStatus = status === 'ALL' || user.useYn === status;
      const matchesType = userType === 'ALL' || user.userType === userType;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [users, search, status, userType]);

  const selected = users.find((user) => user.usrId === selectedUsrId) || filteredUsers[0];

  const columns: Array<AdminDataTableColumn<ManagedUser>> = [
    { id: 'usrId', header: '아이디', width: '140px', cell: (row) => row.usrId },
    { id: 'usrNm', header: '이름', cell: (row) => row.usrNm },
    { id: 'deptName', header: '부서', cell: (row) => row.deptName || '-' },
    {
      id: 'userType',
      header: '유형',
      width: '100px',
      align: 'center',
      cell: (row) => (
        <span className={`${styles.badge} ${row.userType === 'ADMIN' ? styles.badgeWarning : ''}`}>
          {row.userType === 'ADMIN' ? '관리자' : '서비스'}
        </span>
      ),
    },
    {
      id: 'useYn',
      header: '상태',
      width: '88px',
      align: 'center',
      cell: (row) => (
        <span className={`${styles.badge} ${row.useYn === 'Y' ? styles.badgeSuccess : ''}`}>
          {row.useYn === 'Y' ? '사용' : '중지'}
        </span>
      ),
    },
  ];

  return (
    <section className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h2>사용자 관리</h2>
          <p>관리자와 서비스 사용자를 같은 API 모델에서 조회하고 운영합니다.</p>
        </div>
      </div>

      <div className={styles.workspace}>
        <div className={styles.listPane}>
          <AdminFilterBar
            searchValue={search}
            statusValue={status}
            resultLabel={`${filteredUsers.length}명`}
            primaryActionLabel="관리자 등록"
            searchPlaceholder="아이디, 이름, 부서 검색"
            extra={
              <select
                className={styles.fieldSelect}
                aria-label="사용자 유형 필터"
                value={userType}
                onChange={(event) => setUserType(event.target.value)}
              >
                <option value="ALL">전체 유형</option>
                <option value="ADMIN">관리자</option>
                <option value="SERVICE">서비스 사용자</option>
              </select>
            }
            onSearchChange={setSearch}
            onStatusChange={setStatus}
            onPrimaryAction={() => setSelectedUsrId(undefined)}
          />
          <AdminDataTable
            columns={columns}
            rows={filteredUsers}
            getRowId={(row) => row.usrId}
            selectedId={selected?.usrId}
            onRowSelect={(row) => setSelectedUsrId(row.usrId)}
          />
        </div>

        <AdminDrawer
          open={Boolean(selected)}
          title={selected?.usrNm || '관리자 등록'}
          subtitle={selected?.usrId}
          onClose={() => setSelectedUsrId(undefined)}
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
              <span>아이디</span>
              <input value={selected?.usrId || ''} readOnly />
            </label>
            <label className={styles.field}>
              <span>유형</span>
              <select value={selected?.userType || 'ADMIN'} disabled>
                <option value="ADMIN">관리자</option>
                <option value="SERVICE">서비스 사용자</option>
              </select>
            </label>
            <label className={styles.field}>
              <span>이름</span>
              <input value={selected?.usrNm || ''} readOnly />
            </label>
            <label className={styles.field}>
              <span>사용여부</span>
              <select value={selected?.useYn || 'Y'} disabled>
                <option value="Y">사용</option>
                <option value="N">중지</option>
              </select>
            </label>
            <label className={styles.field}>
              <span>부서</span>
              <input value={selected?.deptName || ''} readOnly />
            </label>
            <label className={styles.field}>
              <span>직책</span>
              <input value={selected?.positDivName || ''} readOnly />
            </label>
          </div>
        </AdminDrawer>
      </div>
    </section>
  );
}
