import { User } from 'lucide-react';

import { DialogHeader, DialogTitle, useAuthStore } from '@bx/shared';
import type { ModalConfig } from '@bx/shared';

import styles from './index.module.css';

export function UserInfoModal(_props: ModalConfig) {
  const user = useAuthStore((s) => s.user);

  return (
    <div className={styles.root}>
      <DialogHeader>
        <DialogTitle className={styles.title}>내 정보</DialogTitle>
      </DialogHeader>

      <div className={styles.profile}>
        <div className={styles.avatar}>
          <User size={28} className={styles.avatarIcon} />
        </div>
        <div className={styles.identity}>
          <p className={styles.userName}>{user?.usrNm ?? '사용자'}</p>
          <p className={styles.userId}>{user?.usrId ?? ''}</p>
        </div>
      </div>

      {/* TODO: 상세 정보 섹션 연결 */}
      <div className={styles.detail}>
        <p className={styles.detailText}>상세 정보 준비 중입니다.</p>
      </div>
    </div>
  );
}
