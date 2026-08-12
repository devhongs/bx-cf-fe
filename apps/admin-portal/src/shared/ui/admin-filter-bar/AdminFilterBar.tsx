import { Button, Select } from '@bx/shared';
import { Search } from 'lucide-react';
import type { ReactNode } from 'react';

import styles from './AdminFilterBar.module.css';

interface AdminFilterBarProps {
  searchValue: string;
  searchPlaceholder?: string;
  statusValue?: string;
  statusGroupCd?: string;
  extra?: ReactNode;
  onSearchChange: (value: string) => void;
  onStatusChange?: (value: string) => void;
  onSearch: () => void;
  onReset: () => void;
}

export function AdminFilterBar({
  searchValue,
  searchPlaceholder = '검색어 입력',
  statusValue = '',
  statusGroupCd = 'USE_YN',
  extra,
  onSearchChange,
  onStatusChange,
  onSearch,
  onReset,
}: AdminFilterBarProps) {
  return (
    <form
      className={styles.bar}
      onSubmit={(event) => {
        event.preventDefault();
        onSearch();
      }}
    >
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
          containerClassName={styles.statusSelect}
          className={styles.select}
          aria-label="상태 필터"
          value={statusValue}
          groupCd={statusGroupCd}
          onChange={(event) => onStatusChange(event.target.value)}
        />
      )}

      {extra}

      <div className={styles.actions}>
        <Button type="submit" variant="secondary" className={styles.searchButton}>
          조회
        </Button>
        <Button type="button" variant="outline" onClick={onReset}>
          초기화
        </Button>
      </div>
    </form>
  );
}
