import { Search } from 'lucide-react';
import { useRef } from 'react';

import styles from './AiSearchCard.module.css';

interface AiSearchCardProps {
  onClick?: () => void;
}

export function AiSearchCard({ onClick }: AiSearchCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCardClick = () => {
    inputRef.current?.focus();
    onClick?.();
  };

  return (
    <div onClick={handleCardClick} className={styles.card}>
      {/* 좌측 입력 영역 */}
      <div className={styles.inputArea}>
        <input
          ref={inputRef}
          type="text"
          placeholder="무엇이든 물어보세요..."
          className={styles.input}
        />
      </div>

      {/* 우측 돋보기 아이콘 (absolute 제거, flex 수직 중앙 정렬 강제) */}
      <div className={styles.iconWrapper}>
        <Search className={styles.icon} />
      </div>
    </div>
  );
}
