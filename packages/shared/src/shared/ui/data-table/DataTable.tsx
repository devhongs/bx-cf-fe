import {
  type CSSProperties,
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  type ColumnDef,
  type OnChangeFn,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import clsx from 'clsx';

import styles from './DataTable.module.css';

const SELECT_COLUMN_ID = '__select__';

export type DataTableColumn<T> = {
  id: string;
  header: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  cell: (row: T) => ReactNode;
  /** 정렬 활성화(opt-in). sortValue가 없으면 row[id]로 비교합니다. */
  sortable?: boolean;
  /** 정렬 비교에 쓸 값. 커스텀 cell을 쓸 때 지정합니다. */
  sortValue?: (row: T) => string | number | Date | null | undefined;
  /** 인라인 편집 활성화(opt-in). onCellEdit prop과 함께 동작합니다. */
  editable?: boolean;
  /** 편집 input의 초기값. 없으면 String(row[id])을 사용합니다. */
  editValue?: (row: T) => string;
};

type ColumnMeta<T> = { column?: DataTableColumn<T>; select?: boolean };

export type DataTablePaginationState = PaginationState;
export type DataTableSortingState = SortingState;

export interface DataTableServerSideState {
  pagination: DataTablePaginationState;
  sorting: DataTableSortingState;
  rowCount: number;
  onPaginationChange: (pagination: DataTablePaginationState) => void;
  onSortingChange: (sorting: DataTableSortingState) => void;
}

export interface DataTableProps<T> {
  columns: Array<DataTableColumn<T>>;
  rows: T[];
  getRowId: (row: T) => string | number;
  selectedId?: string | number;
  emptyLabel?: string;
  onRowSelect?: (row: T) => void;
  /** 지정하면 클라이언트 페이지네이션을 활성화합니다. */
  pageSize?: number;
  /**
   * 서버 페이징·정렬 제어 상태.
   * 지정하면 rows는 현재 페이지 데이터로 간주하고 pageSize보다 우선합니다.
   */
  serverSide?: DataTableServerSideState;
  /** editable 컬럼의 편집 커밋 콜백. (row, columnId, 다음값) */
  onCellEdit?: (row: T, columnId: string, value: string) => void;
  /** 지정하면 좌측에 체크박스 열을 추가합니다(다중 선택). */
  selectable?: boolean;
  /** 선택된 행 id 목록(제어). getRowId가 반환하는 값과 같은 기준입니다. */
  selectedRowIds?: Array<string | number>;
  /** 선택 변경 콜백. 현재 선택된 행 전체를 넘겨줍니다. */
  onSelectionChange?: (rows: T[]) => void;
}

const alignClass = <T,>(column: DataTableColumn<T>) => styles[column.align || 'left'];

/**
 * TanStack Table(headless) 기반. 밀도/최소 너비는 CSS 변수로 조정합니다.
 * (기본값: 720px / 44px / 0.8rem)
 * --data-table-min-width, --data-table-row-height, --data-table-font-size
 */
export function DataTable<T>({
  columns,
  rows,
  getRowId,
  selectedId,
  emptyLabel = '표시할 데이터가 없습니다.',
  onRowSelect,
  pageSize,
  serverSide,
  onCellEdit,
  selectable,
  selectedRowIds,
  onSelectionChange,
}: DataTableProps<T>) {
  const interactive = Boolean(onRowSelect);
  const paginated = Boolean(pageSize || serverSide);
  const [clientSorting, setClientSorting] = useState<SortingState>([]);
  const [clientPagination, setClientPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: pageSize ?? 10,
  });
  const sorting = serverSide?.sorting ?? clientSorting;
  const pagination = serverSide?.pagination ?? (pageSize ? clientPagination : undefined);

  const rowSelection = useMemo<RowSelectionState>(() => {
    const map: RowSelectionState = {};
    for (const id of selectedRowIds ?? []) map[String(id)] = true;
    return map;
  }, [selectedRowIds]);
  // 목록에서 사라진 행만 선택 해제한다.
  // 남아 있는 행(삭제 실패로 재시도가 필요한 행 등)은 선택을 유지한다.
  useEffect(() => {
    const selectedCount = Object.keys(rowSelection).length;
    if (selectedCount === 0) return;

    const survivors = rows.filter((row) => rowSelection[String(getRowId(row))]);
    if (survivors.length !== selectedCount) {
      onSelectionChange?.(survivors);
    }
  });

  const handleRowSelectionChange: OnChangeFn<RowSelectionState> = (updater) => {
    const next = typeof updater === 'function' ? updater(rowSelection) : updater;
    const selectedRows = rows.filter((row) => next[String(getRowId(row))]);
    onSelectionChange?.(selectedRows);
  };

  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    const next = typeof updater === 'function' ? updater(sorting) : updater;
    if (serverSide) {
      serverSide.onSortingChange(next);
      if (serverSide.pagination.pageIndex !== 0) {
        serverSide.onPaginationChange({ ...serverSide.pagination, pageIndex: 0 });
      }
      return;
    }
    setClientSorting(next);
  };

  const handlePaginationChange: OnChangeFn<PaginationState> = (updater) => {
    if (!pagination) return;

    const next = typeof updater === 'function' ? updater(pagination) : updater;
    if (next.pageIndex !== pagination.pageIndex && Object.keys(rowSelection).length > 0) {
      onSelectionChange?.([]);
    }

    if (serverSide) {
      serverSide.onPaginationChange(next);
      return;
    }
    setClientPagination(next);
  };

  const columnDefs = useMemo<Array<ColumnDef<T>>>(() => {
    const defs: Array<ColumnDef<T>> = columns.map((column) => ({
      id: column.id,
      header: column.header,
      enableSorting: Boolean(column.sortable),
      // 첫 클릭은 항상 오름차순 (TanStack은 숫자 컬럼을 내림차순 우선으로 처리)
      sortDescFirst: false,
      accessorFn: (row) =>
        column.sortValue ? column.sortValue(row) : (row as Record<string, unknown>)[column.id],
      meta: { column } satisfies ColumnMeta<T>,
      cell: ({ row }) =>
        column.editable && onCellEdit ? (
          <EditableCell
            value={
              column.editValue
                ? column.editValue(row.original)
                : String((row.original as Record<string, unknown>)[column.id] ?? '')
            }
            onCommit={(next) => onCellEdit(row.original, column.id, next)}
          />
        ) : (
          column.cell(row.original)
        ),
    }));

    if (selectable) {
      defs.unshift({
        id: SELECT_COLUMN_ID,
        enableSorting: false,
        meta: { select: true } satisfies ColumnMeta<T>,
        header: ({ table }) => (
          <IndeterminateCheckbox
            aria-label="전체 선택"
            checked={paginated ? table.getIsAllPageRowsSelected() : table.getIsAllRowsSelected()}
            indeterminate={
              paginated ? table.getIsSomePageRowsSelected() : table.getIsSomeRowsSelected()
            }
            onChange={
              paginated
                ? table.getToggleAllPageRowsSelectedHandler()
                : table.getToggleAllRowsSelectedHandler()
            }
          />
        ),
        cell: ({ row }) => (
          <IndeterminateCheckbox
            aria-label="행 선택"
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            onChange={row.getToggleSelectedHandler()}
            onClick={(event) => event.stopPropagation()}
          />
        ),
      });
    }

    return defs;
  }, [columns, onCellEdit, paginated, selectable]);

  const table = useReactTable({
    data: rows,
    columns: columnDefs,
    state: { sorting, rowSelection, ...(pagination ? { pagination } : {}) },
    onSortingChange: handleSortingChange,
    onPaginationChange: handlePaginationChange,
    onRowSelectionChange: handleRowSelectionChange,
    enableRowSelection: Boolean(selectable),
    getRowId: (row) => String(getRowId(row)),
    getCoreRowModel: getCoreRowModel(),
    ...(serverSide
      ? {
          manualPagination: true,
          manualSorting: true,
          rowCount: serverSide.rowCount,
        }
      : {
          getSortedRowModel: getSortedRowModel(),
          ...(pageSize ? { getPaginationRowModel: getPaginationRowModel() } : {}),
        }),
  });

  const pageRows = table.getRowModel().rows;
  const columnCount = columns.length + (selectable ? 1 : 0);
  const pageCount = table.getPageCount();

  // 필터·삭제로 목록이 줄어 현재 페이지가 범위를 벗어나면 마지막 페이지로 당긴다.
  // (그대로 두면 빈 페이지가 뜨는데 페이지 이동 버튼도 함께 사라져 빠져나올 수 없다.)
  useEffect(() => {
    if (!pagination || pageCount === 0) return;
    if (pagination.pageIndex > pageCount - 1) {
      handlePaginationChange({ ...pagination, pageIndex: pageCount - 1 });
    }
  });

  const handleRowKeyDown = (event: KeyboardEvent<HTMLTableRowElement>, row: T) => {
    if (event.target !== event.currentTarget) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onRowSelect?.(row);
    }
  };

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <colgroup>
          {selectable ? <col style={{ '--column-width': '44px' } as CSSProperties} /> : null}
          {columns.map((column) => (
            <col key={column.id} style={{ '--column-width': column.width } as CSSProperties} />
          ))}
        </colgroup>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const meta = header.column.columnDef.meta as ColumnMeta<T> | undefined;
                if (meta?.select) {
                  return (
                    <th key={header.id} className={styles.selectCell}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  );
                }
                const column = meta?.column as DataTableColumn<T>;
                const sortable = header.column.getCanSort();
                const sortDir = header.column.getIsSorted();
                return (
                  <th key={header.id} className={alignClass(column)}>
                    {sortable ? (
                      <button
                        type="button"
                        className={styles.sortButton}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {column.header}
                        <span aria-hidden className={styles.sortIcon}>
                          {sortDir === 'asc' ? '▲' : sortDir === 'desc' ? '▼' : '↕'}
                        </span>
                      </button>
                    ) : (
                      column.header
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {pageRows.length === 0 ? (
            <tr>
              <td colSpan={columnCount} className={styles.empty}>
                {emptyLabel}
              </td>
            </tr>
          ) : (
            pageRows.map((row) => {
              const selected =
                (selectedId !== undefined && String(selectedId) === row.id) || row.getIsSelected();
              const rowClassName = [
                interactive ? styles.interactive : '',
                selected ? styles.selected : '',
              ]
                .filter(Boolean)
                .join(' ');

              return (
                <tr
                  key={row.id}
                  className={rowClassName || undefined}
                  tabIndex={interactive ? 0 : undefined}
                  onClick={interactive ? () => onRowSelect?.(row.original) : undefined}
                  onKeyDown={
                    interactive ? (event) => handleRowKeyDown(event, row.original) : undefined
                  }
                >
                  {row.getVisibleCells().map((cell) => {
                    const meta = cell.column.columnDef.meta as ColumnMeta<T> | undefined;
                    const className = meta?.select
                      ? styles.selectCell
                      : alignClass(meta?.column as DataTableColumn<T>);
                    return (
                      <td key={cell.id} className={className}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {paginated && pageRows.length > 0 ? (
        <div className={styles.pagination}>
          <button
            type="button"
            className={styles.pageButton}
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            이전
          </button>
          <span className={styles.pageInfo}>
            {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
          </span>
          <button
            type="button"
            className={styles.pageButton}
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            다음
          </button>
        </div>
      ) : null}
    </div>
  );
}

interface IndeterminateCheckboxProps extends ComponentPropsWithoutRef<'input'> {
  indeterminate?: boolean;
}

function IndeterminateCheckbox({
  indeterminate,
  className,
  checked,
  ...rest
}: IndeterminateCheckboxProps) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.indeterminate = Boolean(indeterminate) && !checked;
  }, [indeterminate, checked]);

  return (
    <input
      ref={ref}
      type="checkbox"
      className={clsx(styles.checkbox, className)}
      checked={checked}
      {...rest}
    />
  );
}

interface EditableCellProps {
  value: string;
  onCommit: (value: string) => void;
}

function EditableCell({ value, onCommit }: EditableCellProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  if (!editing) {
    return (
      <button
        type="button"
        className={styles.editableDisplay}
        onClick={(event) => {
          event.stopPropagation();
          setDraft(value);
          setEditing(true);
        }}
      >
        {value || '—'}
      </button>
    );
  }

  const commit = () => {
    setEditing(false);
    if (draft !== value) onCommit(draft);
  };

  return (
    <input
      className={styles.editableInput}
      value={draft}
      autoFocus
      onClick={(event) => event.stopPropagation()}
      onChange={(event) => setDraft(event.target.value)}
      onBlur={commit}
      onKeyDown={(event) => {
        event.stopPropagation();
        if (event.key === 'Enter') commit();
        if (event.key === 'Escape') setEditing(false);
      }}
    />
  );
}
