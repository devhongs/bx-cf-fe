import type { ReactNode } from 'react';

import styles from './AdminDataTable.module.css';

export type AdminDataTableColumn<T> = {
  id: string;
  header: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  cell: (row: T) => ReactNode;
};

interface AdminDataTableProps<T> {
  columns: Array<AdminDataTableColumn<T>>;
  rows: T[];
  getRowId: (row: T) => string | number;
  selectedId?: string | number;
  emptyLabel?: string;
  onRowSelect?: (row: T) => void;
}

export function AdminDataTable<T>({
  columns,
  rows,
  getRowId,
  selectedId,
  emptyLabel = '표시할 데이터가 없습니다.',
  onRowSelect,
}: AdminDataTableProps<T>) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <colgroup>
          {columns.map((column) => (
            <col key={column.id} style={{ width: column.width }} />
          ))}
        </colgroup>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.id} className={styles[column.align || 'left']}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className={styles.empty}>
                {emptyLabel}
              </td>
            </tr>
          ) : (
            rows.map((row) => {
              const rowId = getRowId(row);
              const selected = selectedId !== undefined && String(selectedId) === String(rowId);
              return (
                <tr
                  key={rowId}
                  className={selected ? styles.selected : ''}
                  onClick={() => onRowSelect?.(row)}
                >
                  {columns.map((column) => (
                    <td key={column.id} className={styles[column.align || 'left']}>
                      {column.cell(row)}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
