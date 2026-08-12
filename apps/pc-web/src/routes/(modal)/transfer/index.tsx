import { useState } from 'react';

import { DialogDescription, DialogHeader, DialogTitle } from '@bx/shared';
import type { ModalConfig } from '@bx/shared';
import { useModal } from '@bx/shared';

import styles from './index.module.css';

export function TransferModal(_props: ModalConfig) {
  const { close } = useModal();
  const [amount, setAmount] = useState('');
  const [accountNo, setAccountNo] = useState('');

  const handleSubmit = () => {
    // TODO: 이체 API 연결
    close();
  };

  return (
    <div className={styles.root}>
      <DialogHeader>
        <DialogTitle className={styles.title}>이체</DialogTitle>
        <DialogDescription className={styles.description}>
          빠르고 안전하게 송금하세요.
        </DialogDescription>
      </DialogHeader>

      <div className={styles.fields}>
        <div className={styles.field}>
          <label className={styles.label}>계좌번호</label>
          <input
            type="text"
            className={styles.input}
            placeholder="받는 분 계좌번호"
            value={accountNo}
            onChange={(e) => setAccountNo(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>이체 금액</label>
          <input
            type="text"
            inputMode="numeric"
            className={styles.input}
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ''))}
          />
        </div>
      </div>

      <div className={styles.actions}>
        <button type="button" onClick={() => close()} className={styles.cancel}>
          취소
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!amount || !accountNo}
          className={styles.submit}
        >
          이체하기
        </button>
      </div>
    </div>
  );
}
