import type { BaseProps } from '@bx/shared';
import { useModal, useUserName } from '@bx/shared';
import { ChevronRight } from 'lucide-react';

import styles from './HeaderLeft.module.css';

interface HeaderLeftProps extends BaseProps {
  pageTitle: string;
}

export function HeaderLeft({ pageTitle }: HeaderLeftProps) {
  const { open: openModal } = useModal();
  const userName = useUserName();

  const handleUserNameClick = () => {
    openModal({
      path: 'user-info',
    });
  };

  if (pageTitle === '메뉴') {
    return (
      <button type="button" className={styles.title} onClick={handleUserNameClick}>
        {userName}
        <ChevronRight className={styles.icon} size={20} />
      </button>
    );
  }

  return <span className={styles.title}>{pageTitle}</span>;
}
