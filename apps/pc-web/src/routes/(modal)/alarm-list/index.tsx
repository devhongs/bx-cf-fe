import { Bell } from 'lucide-react';

import { DialogHeader, DialogTitle } from '@bx/shared';
import type { ModalConfig } from '@bx/shared';

import styles from './index.module.css';

export function AlarmListModal(_props: ModalConfig) {
  return (
    <div className={styles.root}>
      <DialogHeader>
        <DialogTitle className={styles.title}>알림</DialogTitle>
      </DialogHeader>

      {/* TODO: useFetchAlarmList 연결 */}
      <div className={styles.empty}>
        <Bell size={32} className={styles.emptyIcon} />
        <p className={styles.emptyMessage}>새로운 알림이 없습니다.</p>
      </div>
    </div>
  );
}
