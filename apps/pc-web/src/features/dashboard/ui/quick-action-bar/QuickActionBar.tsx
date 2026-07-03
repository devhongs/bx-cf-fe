import { ArrowRight, Search } from 'lucide-react';
import { useState } from 'react';

import styles from './QuickActionBar.module.css';

export function QuickActionBar() {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    if (!query.trim()) return;
    console.log('검색:', query);
    setQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className={styles.bar}>
      <Search size={16} className={styles.searchIcon} />
      <input
        type="text"
        className={styles.input}
        placeholder="계좌번호, 거래내역, 상품을 검색하세요..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button type="button" className={styles.sendBtn} onClick={handleSearch}>
        <ArrowRight size={16} />
      </button>
    </div>
  );
}
