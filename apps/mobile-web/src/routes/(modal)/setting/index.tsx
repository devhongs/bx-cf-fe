import { useNavigate } from '@tanstack/react-router';
import { LogOut, Moon, Sun } from 'lucide-react';

import { useLogout } from '@bx/shared';
import { useModal } from '@bx/shared';
import type { ModalConfig } from '@bx/shared';
import { IconButton } from '@bx/shared';
import { Modal } from '@bx/shared';
import { useTheme } from '@bx/shared';

import styles from './index.module.css';

interface SettingModalProps extends ModalConfig {
  dummy?: any;
}

export function SettingModal(_props: SettingModalProps) {
  const navigate = useNavigate();
  const { closeAll: closeAllModal } = useModal();
  const { theme, setTheme } = useTheme();
  const { mutate: logout, isPending } = useLogout({
    onSettled: () => {
      navigate({ to: '/login' });
      closeAllModal();
    },
  });

  const handleLogoutClick = () => {
    logout();
  };

  const handleThemeClick = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Modal closeButtonType="close">
      <Modal.Title>설정</Modal.Title>
      <Modal.Body>
        <div className={styles.list}>
          <IconButton
            className={styles.item}
            size="lg"
            icon={theme === 'dark' ? Sun : Moon}
            label={theme === 'dark' ? '라이트 테마' : '다크 테마'}
            onClick={handleThemeClick}
          />
          <IconButton
            className={styles.item}
            size="lg"
            icon={LogOut}
            label="로그아웃"
            onClick={handleLogoutClick}
            disabled={isPending}
          />
        </div>
      </Modal.Body>
    </Modal>
  );
}
