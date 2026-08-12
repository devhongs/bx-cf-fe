import { useNavigate } from '@tanstack/react-router';
import { LogOut, User } from 'lucide-react';

import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
  useAuthStore,
  useLogout,
  useModal,
} from '@bx/shared';
import type { ModalConfig } from '@bx/shared';

import styles from './index.module.css';

export function SettingModal(_props: ModalConfig) {
  const navigate = useNavigate();
  const { closeAll } = useModal();
  const user = useAuthStore((s) => s.user);
  const { mutate: logout, isPending } = useLogout({
    onSettled: () => {
      closeAll();
      navigate({ to: '/login' });
    },
  });

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={styles.root}>
      <DialogHeader>
        <DialogTitle className={styles.title}>설정</DialogTitle>
        <DialogDescription className={styles.description}>
          계정 및 앱 설정을 관리합니다.
        </DialogDescription>
      </DialogHeader>

      {/* 계정 정보 */}
      <div className={styles.account}>
        <div className={styles.avatar}>
          <User size={18} className={styles.avatarIcon} />
        </div>
        <div>
          <p className={styles.userName}>{user?.usrNm ?? '사용자'}</p>
          <p className={styles.userId}>{user?.usrId ?? ''}</p>
        </div>
      </div>

      {/* 로그아웃 */}
      <button type="button" onClick={handleLogout} disabled={isPending} className={styles.logout}>
        <LogOut size={16} />
        <span className={styles.logoutLabel}>로그아웃</span>
      </button>
    </div>
  );
}
