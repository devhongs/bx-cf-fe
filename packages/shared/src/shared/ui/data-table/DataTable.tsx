import type { KeyboardEvent, ReactNode } from 'react';

import styles from './DataTable.module.css';

export type DataTableColumn<T> = {
  id: string;
  header: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  cell: (row: T) => ReactNode;
};

export interface DataTableProps<T> {
  columns: Array<DataTableColumn<T>>;
  rows: T[];
  getRowId: (row: T) => string | number;
  selectedId?: string | number;
  emptyLabel?: string;
  onRowSelect?: (row: T) => void;
}

/**
 * 밀도/최소 너비는 CSS 변수로 조정합니다. (기본값: 720px / 44px / 0.8rem)
 * --data-table-min-width, --data-table-row-height, --data-table-font-size
 */
export function DataTable<T>({
  columns,
  rows,
  getRowId,
  selectedId,
  emptyLabel = '표시할 데이터가 없습니다.',
  onRowSelect,
}: DataTableProps<T>) {
  const interactive = Boolean(onRowSelect);

  const handleRowKeyDown = (event: KeyboardEvent<HTMLTableRowElement>, row: T) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onRowSelect?.(row);
    }
  };

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
              const rowClassName = [
                interactive ? styles.interactive : '',
                selected ? styles.selected : '',
              ]
                .filter(Boolean)
                .join(' ');

              return (
                <tr
                  key={rowId}
                  className={rowClassName || undefined}
                  tabIndex={interactive ? 0 : undefined}
                  onClick={interactive ? () => onRowSelect?.(row) : undefined}
                  onKeyDown={interactive ? (event) => handleRowKeyDown(event, row) : undefined}
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
