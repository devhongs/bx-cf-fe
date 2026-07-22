import { DialogDescription, DialogHeader, DialogTitle } from '@bx/shared';
import type { ModalConfig } from '@bx/shared';

import styles from './index.module.css';

type AccountDetailProps = {
  accountNo?: string;
  bankId?: string;
  name?: string;
};

interface AccountDetailModalProps extends ModalConfig {
  props?: AccountDetailProps;
}

export function AccountDetailModal({ props }: AccountDetailModalProps) {
  const { accountNo = '', name = '' } = props ?? {};

  return (
    <div className={styles.root}>
      <DialogHeader>
        <DialogTitle className={styles.title}>계좌 상세</DialogTitle>
        <DialogDescription className={styles.description}>{name}</DialogDescription>
      </DialogHeader>

      <div className={styles.account}>
        <p className={styles.accountLabel}>계좌번호</p>
        <p className={styles.accountNumber}>{accountNo}</p>
      </div>

      {/* TODO: 거래내역 등 상세 피처 연결 */}
      <div className={styles.history}>
        <p className={styles.historyMessage}>거래 내역을 불러오는 중...</p>
      </div>
    </div>
  );
}
