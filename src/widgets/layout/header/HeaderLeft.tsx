import { ChevronRight } from 'lucide-react';

import { useModal } from '@/shared/hooks';
import type { BaseProps } from '@/shared/types';

import styles from './HeaderLeft.module.css';

interface HeaderLeftProps extends BaseProps {
  pageTitle: string;
}

export function HeaderLeft({ pageTitle }: HeaderLeftProps) {
  const { open: openModal } = useModal();

  const handleUserNameClick = () => {
    openModal({
      path: 'user-info',
    });
  };

  if (pageTitle === '메뉴') {
    return (
      <button type="button" className={styles.title} onClick={handleUserNameClick}>
        사용자명
        <ChevronRight className={styles.icon} color="#888888" size={20} />
      </button>
    );
  }

  return <span className={styles.title}>{pageTitle}</span>;
}
