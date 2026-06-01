import { useEffect, useState } from 'react';

import type { BankId } from '@/entities/account';
import { BANK_OPTIONS } from '@/shared/constants';
import { formatAccountNumberByBank } from '@/shared/lib/utils';
import type { BaseProps } from '@/shared/types';
import { Input, Button } from '@/shared/ui';

import styles from './index.module.css';

interface TransferAmountProps extends BaseProps {
  bankId?: BankId;
  accountNo?: string;
  name?: string;
}

export function TransferAmount({ bankId, accountNo, name }: TransferAmountProps) {
  const [selectedBankId, setSelectedBankId] = useState<BankId | undefined>(bankId);
  const [targetAccountNo, setTargetAccountNo] = useState(accountNo ?? '');
  const [receiverName, setReceiverName] = useState(name ?? '');
  const [amount, setAmount] = useState<string>('');

  const bankName = BANK_OPTIONS.find((bank) => bank.id === bankId)?.name || '';
  const formattedAccountNo = formatAccountNumberByBank(selectedBankId, targetAccountNo);

  useEffect(() => {
    setSelectedBankId(bankId);
    setTargetAccountNo(accountNo ?? '');
    setReceiverName(name ?? '');
  }, [bankId, accountNo, name]);

  return (
    <div className={styles.transferAmountContainer}>
      {/* 수신자 정보 */}
      <div className={styles.receiverInfo}>
        <div className={styles.receiverName}>{receiverName}</div>
        <div className={styles.receiverBankName}>{bankName}</div>
        <div className={styles.receiverAccountNo}>{formattedAccountNo}</div>
      </div>

      {/* 금액 입력 영역 */}
      <div className={styles.amountInputSection}>
        <div className={styles.amountInputTitle}>얼마를 보낼까요?</div>
        <div className={styles.amountInputContainer}>
          <Input
            type="text"
            inputMode="numeric"
            placeholder=""
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ''))}
            className={styles.amountInput}
          />
          <span className={styles.amountUnit}>원</span>
        </div>
      </div>

      {/* 계좌 표시 영역 */}
      <div className={styles.ownAccountInfo}>
        {/* 내 계좌, 잔액 표시 / 수정하기 */}
        <span>{bankName}(8901)</span>
        <span>1,234,567원</span>
      </div>

      {/* 다음 버튼 */}
      <Button
        type="button"
        disabled={!amount}
        className={`${styles.submitButton} ${!amount ? styles.disabled : styles.enabled}`}
      >
        다음
      </Button>
    </div>
  );
}
