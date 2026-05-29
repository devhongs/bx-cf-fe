import { useEffect, useState } from 'react';

import { useFetchRecentAccounts } from '@/entities/account';
import type { Account, BankId } from '@/entities/account';
import { BANK_OPTIONS } from '@/shared/constants';
import { useModal } from '@/shared/hooks';
import { formatAccountNumberByBank } from '@/shared/lib/utils';
import type { BaseProps } from '@/shared/types';
import { Input, Button, Select } from '@/shared/ui';

import styles from './index.module.css';

interface TransferListProps extends BaseProps {
  dummy?: any;
}

export function TransferList({ dummy }: TransferListProps) {
  const { data } = useFetchRecentAccounts({ userId: '' });
  const content = data?.content;
  const [recentAccounts, setRecentAccounts] = useState<Array<any>>([]);
  const [accountNum, setAccountNum] = useState<string>('');
  const [bankId, setBankId] = useState<BankId>();

  const { open: openModal } = useModal();

  useEffect(() => {
    if (content) {
      setRecentAccounts(content);
    }
  }, [content]);

  const handleNextClick = (acc?: Account) => {
    const targetBankId = acc?.bankId ?? bankId;
    const targetAccountNum = acc?.accountNo ?? accountNum;
    if (!targetBankId || !targetAccountNum) return;

    openModal({
      path: 'transfer-amount',
      props: {
        bankId: targetBankId,
        accountNo: targetAccountNum,
        name: acc?.name,
      },
    });
  };

  return (
    <div className={styles.transferListContainer}>
      {/* 타이틀 */}
      <div className={styles.transferTitle}>누구에게 보낼까요?</div>
      {/* 입력 폼 */}
      <form className={styles.transferForm}>
        {/* 계좌번호 입력 */}
        <Input
          type="text"
          inputMode="numeric"
          placeholder="계좌번호를 입력해주세요"
          className={styles.formInput}
          value={accountNum}
          onChange={(e) => setAccountNum(e.target.value)}
          onEnter={() => handleNextClick()}
        />

        {/* 은행 선택 */}
        <Select
          className={styles.formSelect}
          value={bankId ?? ''}
          onChange={(e) => setBankId(e.target.value as BankId)}
          options={BANK_OPTIONS.map((bank) => ({ value: bank.id, label: bank.name }))}
          placeholder="은행 선택"
        />

        {/* 다음 버튼 */}
        <Button type="button" className={styles.submitButton} onClick={() => handleNextClick()}>
          다음
        </Button>
      </form>
      {/* 최근 보낸 계좌 */}
      <section className={styles.recentSection}>
        <div className={styles.recentTitle}>최근 보낸 계좌</div>

        <div className={styles.recentList} role="list">
          {recentAccounts.map((acc) => {
            const bank = BANK_OPTIONS.find((b) => b.id === acc.bankId);
            const bankName = bank ? bank.name : acc.bankId;

            const formattedAccountNum = formatAccountNumberByBank(acc.bankId, acc.accountNo);

            return (
              <div
                className={styles.recentItem}
                key={acc.accountNo}
                role="listitem"
                onClick={() => handleNextClick(acc)}
              >
                <div className={styles.recentName}>{acc.name}</div>
                <div className={styles.recentNumber}>
                  {bankName} {formattedAccountNum}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
