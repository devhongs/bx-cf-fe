import type { DataTableColumn, ManagedUser } from '@bx/shared';

import { $codeUtils, DataTableBox, Select, useDeleteUser, useFetchUserList } from '@bx/shared';
import { useState } from 'react';

import { UserFormDrawer } from '@/features/user-form/ui/UserFormDrawer';
import { deleteSelectedItems } from '@/shared/lib/deleteSelectedItems';
import { AdminFilterBar } from '@/shared/ui/admin-filter-bar/AdminFilterBar';

import styles from './index.module.css';

const getUserRowId = (user: ManagedUser) => user.usrId;
const emptyFilters = { search: '', status: '', userType: '' };

export function UsersPage() {
  const [draftFilters, setDraftFilters] = useState(emptyFilters);
  const [appliedFilters, setAppliedFilters] = useState(emptyFilters);
  const { data } = useFetchUserList(undefined, { retry: false });
  const users = data || [];
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedUsrId, setSelectedUsrId] = useState<string | undefined>();
  const deleteUser = useDeleteUser();

  const filteredUsers = users.filter((user) => {
    const keyword = `${user.usrId} ${user.usrNm} ${user.deptName ?? ''}`.toLowerCase();
    const matchesSearch = keyword.includes(appliedFilters.search.toLowerCase());
    const matchesStatus = !appliedFilters.status || user.useYn === appliedFilters.status;
    const matchesType = !appliedFilters.userType || user.userType === appliedFilters.userType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const selected = users.find((user) => user.usrId === selectedUsrId);

  const columns: Array<DataTableColumn<ManagedUser>> = [
    { id: 'usrId', header: '아이디', width: '140px', sortable: true, cell: (row) => row.usrId },
    { id: 'usrNm', header: '이름', sortable: true, cell: (row) => row.usrNm },
    {
      id: 'deptName',
      header: '부서',
      sortable: true,
      sortValue: (row) => row.deptName ?? '',
      cell: (row) => row.deptName || '-',
    },
    {
      id: 'userType',
      header: '유형',
      width: '100px',
      align: 'center',
      sortable: true,
      sortValue: (row) => row.userType ?? '',
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
      sortable: true,
      sortValue: (row) => row.useYn ?? '',
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

  const handleBulkDelete = async (selectedUsers: ManagedUser[]): Promise<ManagedUser[]> => {
    // 개별 실패는 전역 에러 알럿(MutationCache.onError)이 처리한다.
    const { failed } = await deleteSelectedItems(selectedUsers, (user) =>
      deleteUser.mutateAsync(user.usrId),
    );
    return failed;
  };

  const resetFilters = () => {
    setDraftFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
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
            searchValue={draftFilters.search}
            statusValue={draftFilters.status}
            searchPlaceholder="아이디, 이름, 부서 검색"
            extra={
              <Select
                containerClassName={styles.userTypeSelect}
                className={styles.fieldSelect}
                aria-label="사용자 유형 필터"
                value={draftFilters.userType}
                groupCd="USER_TYPE"
                onChange={(event) =>
                  setDraftFilters((current) => ({
                    ...current,
                    userType: event.target.value,
                  }))
                }
              />
            }
            onSearchChange={(search) => setDraftFilters((current) => ({ ...current, search }))}
            onStatusChange={(status) => setDraftFilters((current) => ({ ...current, status }))}
            onSearch={() => setAppliedFilters(draftFilters)}
            onReset={resetFilters}
          />
          <DataTableBox
            rows={filteredUsers}
            getRowId={getUserRowId}
            onCreate={() => openUserDrawer()}
            onDelete={handleBulkDelete}
          >
            <DataTableBox.Table
              columns={columns}
              selectedId={selected?.usrId}
              onRowSelect={(row) => openUserDrawer(row.usrId)}
              pageSize={10}
            />
          </DataTableBox>
        </div>

        <UserFormDrawer open={drawerOpen} user={selected} onClose={closeDrawer} />
      </div>
    </section>
  );
}
