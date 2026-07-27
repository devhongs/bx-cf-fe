import { useState } from 'react';

import { DataTable, type DataTableColumn } from './DataTable';
import styles from './DataTable.stories.module.css';

interface Row {
  id: string;
  code: string;
  name: string;
  qty: number;
  status: string;
}

const seed: Row[] = Array.from({ length: 23 }, (_, i) => ({
  id: `R${i + 1}`,
  code: `CODE_${String(i + 1).padStart(2, '0')}`,
  name: ['알파', '브라보', '찰리', '델타', '에코'][i % 5],
  qty: ((i * 7) % 50) + 1,
  status: i % 3 === 0 ? 'N' : 'Y',
}));

export default {
  title: 'Shared/DataTable',
  component: DataTable,
  parameters: { layout: 'padded' },
};

/** 기존 3개 페이지가 쓰는 그대로 — 조회 전용. */
export const Basic = {
  render: () => {
    const columns: Array<DataTableColumn<Row>> = [
      { id: 'code', header: '코드', width: '160px', cell: (row) => row.code },
      { id: 'name', header: '이름', cell: (row) => row.name },
      { id: 'qty', header: '수량', width: '80px', align: 'right', cell: (row) => row.qty },
    ];
    return <DataTable columns={columns} rows={seed.slice(0, 5)} getRowId={(row) => row.id} />;
  },
};

/** 정렬(opt-in) + 페이지네이션. */
export const SortableAndPaginated = {
  render: () => {
    const columns: Array<DataTableColumn<Row>> = [
      { id: 'code', header: '코드', width: '160px', sortable: true, cell: (row) => row.code },
      { id: 'name', header: '이름', sortable: true, cell: (row) => row.name },
      {
        id: 'qty',
        header: '수량',
        width: '90px',
        align: 'right',
        sortable: true,
        sortValue: (row) => row.qty,
        cell: (row) => row.qty,
      },
    ];
    return <DataTable columns={columns} rows={seed} getRowId={(row) => row.id} pageSize={8} />;
  },
};

/** 다중 선택(opt-in) — 체크박스로 여러 행을 선택합니다. */
export const Selectable = {
  render: () => {
    const [checkedIds, setCheckedIds] = useState<Array<string | number>>([]);
    const columns: Array<DataTableColumn<Row>> = [
      { id: 'code', header: '코드', width: '160px', cell: (row) => row.code },
      { id: 'name', header: '이름', cell: (row) => row.name },
      { id: 'qty', header: '수량', width: '90px', align: 'right', cell: (row) => row.qty },
    ];
    return (
      <div className={styles.selectionExample}>
        <div className={styles.selectionSummary}>선택됨: {checkedIds.join(', ') || '없음'}</div>
        <DataTable
          columns={columns}
          rows={seed.slice(0, 8)}
          getRowId={(row) => row.id}
          selectable
          selectedRowIds={checkedIds}
          onSelectionChange={(rows) => setCheckedIds(rows.map((row) => row.id))}
        />
      </div>
    );
  },
};

/** 셀 인라인 편집(opt-in) — 편집 시 로컬 상태를 갱신합니다. */
export const InlineEditing = {
  render: () => {
    const [rows, setRows] = useState(seed.slice(0, 6));
    const columns: Array<DataTableColumn<Row>> = [
      { id: 'code', header: '코드', width: '160px', cell: (row) => row.code },
      { id: 'name', header: '이름 (더블클릭 편집)', editable: true, cell: (row) => row.name },
      {
        id: 'qty',
        header: '수량 (편집)',
        width: '120px',
        align: 'right',
        editable: true,
        cell: (row) => row.qty,
      },
    ];
    return (
      <DataTable
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        onCellEdit={(row, columnId, value) => {
          setRows((prev) =>
            prev.map((r) =>
              r.id === row.id
                ? { ...r, [columnId]: columnId === 'qty' ? Number(value) || 0 : value }
                : r,
            ),
          );
        }}
      />
    );
  },
};
