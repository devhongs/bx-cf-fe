import { Plus, Search } from 'lucide-react';
import type { ReactNode } from 'react';

import { Select } from '@bx/shared';

import styles from './AdminFilterBar.module.css';

interface AdminFilterBarProps {
  searchValue: string;
  searchPlaceholder?: string;
  statusValue?: string;
  statusGroupCd?: string;
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
  statusValue = '',
  statusGroupCd = 'USE_YN',
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
        <Select
          containerClassName="w-[120px]"
          className={styles.select}
          aria-label="상태 필터"
          value={statusValue}
          groupCd={statusGroupCd}
          onChange={(event) => onStatusChange(event.target.value)}
        />
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
