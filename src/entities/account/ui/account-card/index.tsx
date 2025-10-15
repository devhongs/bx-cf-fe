import { formatAccountNumberByBank } from '@/shared/lib/utils'
import type { BaseProps } from '@/shared/types'

import type { BankId } from '../../model/account.type'

import styles from './index.module.css'

interface AccountCardProps extends BaseProps {
  data: {
    bankId: BankId
    accountNo: string
    accountName: string
    amount: number
  }
}

export default function AccountCard({ data }: AccountCardProps) {
  const formatAccountNum = formatAccountNumberByBank(
    data.bankId,
    data.accountNo,
  )

  const formatAmount = data.amount.toLocaleString('ko-KR')

  return (
    <div className={styles.border}>
      <div className={styles.accountName}>{data.accountName}</div>
      <div className={styles.accountNo}>{formatAccountNum}</div>
      <div className={styles.amount}>{formatAmount}원</div>
    </div>
  )
}
