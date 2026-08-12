import type { BaseProps } from '@bx/shared';
import { IconButton, useModal } from '@bx/shared';
import { Bell, Settings } from 'lucide-react';

import styles from './HeaderRight.module.css';

interface HeaderRightProps extends BaseProps {
  pageTitle: string;
}

export function HeaderRight({ pageTitle }: HeaderRightProps) {
  const { open: openModal } = useModal();

  const isShowSetting = pageTitle === '메뉴';

  const handleAlarm = () => {
    openModal({
      path: 'alarm-list', // 폴더명만 입력!
    });
  };

  const handleSettingClick = () => {
    openModal({
      path: 'setting',
    });
  };

  return (
    <>
      {isShowSetting ? (
        <IconButton
          className={styles.icon}
          size="sm"
          icon={Settings}
          onClick={handleSettingClick}
        />
      ) : (
        <IconButton icon={Bell} onClick={handleAlarm} />
      )}
    </>
  );
}
