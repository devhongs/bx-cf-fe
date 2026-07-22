import { useMemo, useState } from 'react';

import { $codeUtils, DataTable, Select, useFetchUserList } from '@bx/shared';
import type { DataTableColumn, ManagedUser } from '@bx/shared';

import { UserFormDrawer } from '@/features/user-form/ui/UserFormDrawer';
import { AdminFilterBar } from '@/shared/ui/admin-filter-bar/AdminFilterBar';

import styles from '../admin-page.module.css';

export function UsersPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [userType, setUserType] = useState('');
  const { data } = useFetchUserList(undefined, { retry: false });
  const users = data || [];
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedUsrId, setSelectedUsrId] = useState<string | undefined>();

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const keyword = `${user.usrId} ${user.usrNm} ${user.deptName ?? ''}`.toLowerCase();
      const matchesSearch = keyword.includes(search.toLowerCase());
      const matchesStatus = !status || user.useYn === status;
      const matchesType = !userType || user.userType === userType;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [users, search, status, userType]);

  const selected = users.find((user) => user.usrId === selectedUsrId);

  const columns: Array<DataTableColumn<ManagedUser>> = [
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
          {$codeUtils.codeValue('USER_TYPE', row.userType ?? '', { visibleCode: false })}
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
          {$codeUtils.codeValue('USER_STATUS', row.useYn ?? '', { visibleCode: false })}
        </span>
      ),
    },
  ];

  const openUserDrawer = (usrId?: string) => {
    setSelectedUsrId(usrId);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelectedUsrId(undefined);
  };

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
              <Select
                containerClassName={styles.userTypeSelect}
                className={styles.fieldSelect}
                aria-label="사용자 유형 필터"
                value={userType}
                groupCd="USER_TYPE"
                onChange={(event) => setUserType(event.target.value)}
              />
            }
            onSearchChange={setSearch}
            onStatusChange={setStatus}
            onPrimaryAction={() => openUserDrawer()}
          />
          <DataTable
            columns={columns}
            rows={filteredUsers}
            getRowId={(row) => row.usrId}
            selectedId={selected?.usrId}
            onRowSelect={(row) => openUserDrawer(row.usrId)}
          />
        </div>

        <UserFormDrawer
          open={drawerOpen}
          usrId={selectedUsrId}
          fallback={selected}
          onClose={closeDrawer}
        />
      </div>
    </section>
  );
}
