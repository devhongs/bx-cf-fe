import { Plus, Search } from 'lucide-react';
import type { ReactNode } from 'react';

import styles from './AdminFilterBar.module.css';

interface AdminFilterBarProps {
  searchValue: string;
  searchPlaceholder?: string;
  statusValue?: string;
  statusOptions?: Array<{ label: string; value: string }>;
  resultLabel?: string;
  primaryActionLabel?: string;
  extra?: ReactNode;
  onSearchChange: (value: string) => void;
  onStatusChange?: (value: string) => void;
  onPrimaryAction?: () => void;
}

export function AdminFilterBar({
  searchValue,
  searchPlaceholder = '검색어 입력',
  statusValue = 'ALL',
  statusOptions = [
    { label: '전체', value: 'ALL' },
    { label: '사용', value: 'Y' },
    { label: '미사용', value: 'N' },
  ],
  resultLabel,
  primaryActionLabel,
  extra,
  onSearchChange,
  onStatusChange,
  onPrimaryAction,
}: AdminFilterBarProps) {
  return (
    <div className={styles.bar}>
      <label className={styles.search}>
        <Search size={15} />
        <input
          value={searchValue}
          placeholder={searchPlaceholder}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </label>

      {onStatusChange && (
        <select
          className={styles.select}
          aria-label="상태 필터"
          value={statusValue}
          onChange={(event) => onStatusChange(event.target.value)}
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}

      {extra}

      <div className={styles.spacer} />

      {resultLabel && <span className={styles.result}>{resultLabel}</span>}

      {primaryActionLabel && onPrimaryAction && (
        <button type="button" className={styles.primary} onClick={onPrimaryAction}>
          <Plus size={15} />
          <span>{primaryActionLabel}</span>
        </button>
      )}
    </div>
  );
}
