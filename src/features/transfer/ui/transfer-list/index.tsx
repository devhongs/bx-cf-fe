import { useEffect, useState } from 'react'

import { useFetchRecentAccounts } from '@/entities/account'
import type { BankId } from '@/entities/account'
import { formatAccountNumberByBank } from '@/shared/lib/utils'
import type { BaseProps } from '@/shared/types'

import styles from './index.module.css'

interface TransferListProps extends BaseProps {
  dummy?: any
}

const BANK_OPTIONS: Array<{ id: BankId; name: string }> = [
  { id: 'KB', name: 'KB국민은행' },
  { id: 'SH', name: '신한은행' },
  { id: 'HN', name: '하나은행' },
  { id: 'WR', name: '우리은행' },
  { id: 'NH', name: 'NH농협은행' },
  { id: 'IBK', name: 'IBK기업은행' },
  { id: 'KDB', name: 'KDB산업은행' },
  { id: 'SC', name: 'SC제일은행' },
  { id: 'CT', name: '씨티은행' },
  { id: 'KT', name: '케이뱅크' },
  { id: 'KK', name: '카카오뱅크' },
  { id: 'TS', name: '토스뱅크' },
]

export default function TransferList({ dummy }: TransferListProps) {
  const { data } = useFetchRecentAccounts({ userId: '' })
  const content = data?.content
  const [recentAccounts, setRecentAccounts] = useState<Array<any>>([])
  const [accountNum, setAccountNum] = useState<string>('')
  const [bankId, setBankId] = useState<BankId>()

  useEffect(() => {
    if (content) {
      setRecentAccounts(content)
    }
  }, [content])

  return (
    <div className={styles.transferListContainer}>
      {/* 타이틀 */}
      <div className={styles.transferTitle}>누구에게 보낼까요?</div>
      {/* 입력 폼 */}
      <form className={styles.transferForm}>
        {/* 계좌번호 입력 */}
        <input
          type="text"
          inputMode="numeric"
          placeholder="계좌번호를 입력해주세요"
          className={styles.formInput}
          value={accountNum}
          onChange={(e) => setAccountNum(e.target.value)}
        />

        {/* 은행 선택 */}
        <select
          className={styles.formSelect}
          value={bankId ?? ''}
          onChange={(e) => setBankId(e.target.value as BankId)}
        >
          <option value="" disabled>
            은행 선택
          </option>
          {BANK_OPTIONS.map((bank) => (
            <option
              key={bank.id}
              value={bank.id}
              className={styles.selectOption}
            >
              {bank.name}
            </option>
          ))}
        </select>

        {/* 다음 버튼 */}
        <button type="submit" className={styles.submitButton}>
          다음
        </button>
      </form>
      {/* 최근 보낸 계좌 */}
      <section className={styles.recentSection}>
        <div className={styles.recentTitle}>최근 보낸 계좌</div>

        <div className={styles.recentList} role="list">
          {recentAccounts.map((acc) => {
            const bank = BANK_OPTIONS.find((b) => b.id === acc.bankId)
            const bankName = bank ? bank.name : acc.bankId

            const formattedAccountNum = formatAccountNumberByBank(
              acc.bankId,
              acc.accountNo,
            )

            return (
              <div
                className={styles.recentItem}
                key={acc.accountNo}
                role="listitem"
              >
                <div className={styles.recentName}>{acc.name}</div>
                <div className={styles.recentNumber}>
                  {bankName} {formattedAccountNum}
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
