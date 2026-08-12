import { Plus, Trash2 } from 'lucide-react';
import {
  Children,
  createContext,
  isValidElement,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { openDeleteConfirm } from '../../model/alert/alert.store';
import { Button } from '../button/Button';
import { DataTable, type DataTableProps } from '../data-table/DataTable';
import styles from './DataTableBox.module.css';

type RowId = string | number;

export type DataTableBoxDeleteHandler<T> = (
  selectedRows: T[],
) => undefined | T[] | Promise<undefined | T[]>;

export interface DataTableBoxProps<T> {
  rows: T[];
  getRowId: (row: T) => RowId;
  children: ReactNode;
  onCreate?: () => void;
  onDelete?: DataTableBoxDeleteHandler<T>;
  canDelete?: (selectedRows: T[]) => boolean;
}

export interface DataTableBoxSelection<T> {
  rows: T[];
  getRowId: (row: T) => RowId;
  selectedRows: T[];
  selectedRowIds: RowId[];
  selectionCount: number;
  setSelectedRows: (rows: T[]) => void;
  clearSelection: () => void;
}

interface DataTableBoxHeaderProps {
  children?: ReactNode;
}

interface DataTableBoxContextValue<T> extends DataTableBoxSelection<T> {
  onCreate?: () => void;
  onDelete?: DataTableBoxDeleteHandler<T>;
  canDelete?: (selectedRows: T[]) => boolean;
}

type DataTableBoxTableProps<T> = Omit<
  DataTableProps<T>,
  'rows' | 'getRowId' | 'selectable' | 'selectedRowIds' | 'onSelectionChange'
>;

const DataTableBoxContext = createContext<DataTableBoxContextValue<unknown> | null>(null);

export function useDataTableBoxSelection<T>(): DataTableBoxSelection<T> {
  const context = useContext(DataTableBoxContext);

  if (!context) {
    throw new Error('DataTableBox compound components must be used inside DataTableBox.');
  }

  return context as DataTableBoxSelection<T>;
}

function useDataTableBoxContext<T>(): DataTableBoxContextValue<T> {
  const context = useContext(DataTableBoxContext);

  if (!context) {
    throw new Error('DataTableBox compound components must be used inside DataTableBox.');
  }

  return context as DataTableBoxContextValue<T>;
}

function DataTableBoxRoot<T>({
  rows,
  getRowId,
  children,
  onCreate,
  onDelete,
  canDelete,
}: DataTableBoxProps<T>) {
  const [selectedRows, setSelectedRows] = useState<T[]>([]);
  const selectedRowIds = useMemo(
    () => selectedRows.map((row) => getRowId(row)),
    [getRowId, selectedRows],
  );
  const clearSelection = useCallback(() => setSelectedRows([]), []);
  const value = useMemo<DataTableBoxContextValue<T>>(
    () => ({
      rows,
      getRowId,
      selectedRows,
      selectedRowIds,
      selectionCount: selectedRows.length,
      setSelectedRows,
      clearSelection,
      onCreate,
      onDelete,
      canDelete,
    }),
    [canDelete, clearSelection, getRowId, onCreate, onDelete, rows, selectedRows, selectedRowIds],
  );
  const hasExplicitHeader = Children.toArray(children).some(
    (child) => isValidElement(child) && child.type === DataTableBoxHeader,
  );
  const showImplicitHeader = !hasExplicitHeader && Boolean(onCreate || onDelete);

  return (
    <DataTableBoxContext.Provider value={value as DataTableBoxContextValue<unknown>}>
      <section className={styles.box}>
        {showImplicitHeader ? <DataTableBoxHeader /> : null}
        {children}
      </section>
    </DataTableBoxContext.Provider>
  );
}

function DataTableBoxHeader({ children }: DataTableBoxHeaderProps) {
  const {
    rows,
    selectedRows,
    selectionCount,
    clearSelection,
    setSelectedRows,
    onCreate,
    onDelete,
    canDelete,
  } = useDataTableBoxContext<unknown>();
  const [pending, setPending] = useState(false);
  const deleteEnabled = selectionCount > 0 && (canDelete ? canDelete(selectedRows) : true);

  const handleDelete = async () => {
    if (!onDelete || !deleteEnabled || pending) return;

    setPending(true);

    try {
      const confirmed = await openDeleteConfirm({
        message: `선택한 ${selectionCount}건을 삭제하시겠습니까?`,
      });
      if (!confirmed) return;

      const remainingRows = await onDelete([...selectedRows]);
      setSelectedRows(Array.isArray(remainingRows) ? remainingRows : []);
    } catch {
      // 전역 MutationCache가 오류를 표시하며 선택은 재시도를 위해 유지한다.
    } finally {
      setPending(false);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.summary} aria-live="polite">
        {selectionCount > 0 ? (
          <>
            <strong>{selectionCount}건 선택됨</strong>
            <button type="button" className={styles.clear} onClick={clearSelection}>
              선택 해제
            </button>
          </>
        ) : (
          <span>전체 {rows.length}건</span>
        )}
      </div>
      <div className={styles.actions}>
        {children}
        {selectionCount > 0 && onDelete ? (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={pending || !deleteEnabled}
          >
            <Trash2 size={14} />
            삭제
          </Button>
        ) : null}
        {onCreate ? (
          <Button type="button" size="sm" onClick={onCreate}>
            <Plus size={15} />
            등록
          </Button>
        ) : null}
      </div>
    </header>
  );
}

function DataTableBoxTable<T>(props: DataTableBoxTableProps<T>) {
  const { rows, getRowId, selectedRowIds, setSelectedRows } = useDataTableBoxSelection<T>();

  return (
    <DataTable
      {...props}
      rows={rows}
      getRowId={getRowId}
      selectable
      selectedRowIds={selectedRowIds}
      onSelectionChange={setSelectedRows}
    />
  );
}

export const DataTableBox = Object.assign(DataTableBoxRoot, {
  Header: DataTableBoxHeader,
  Table: DataTableBoxTable,
});
