import { ChevronRight } from 'lucide-react';

import { useModal } from '@/shared/hooks';
import type { BaseProps } from '@/shared/types';
import { IconButton } from '@/shared/ui';

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
      <span className={styles.title} onClick={handleUserNameClick}>
        사용자명
        <IconButton className={styles.icon} icon={ChevronRight} iconColor="#888888" />
      </span>
    );
  }

  return <span className={styles.title}>{pageTitle}</span>;
}
