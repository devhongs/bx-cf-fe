import styles from './index.module.css'

import type { BaseProps } from '@/shared/types'

interface AccountCardProps extends BaseProps {
  data: {
    accountNo: number
    accountName: string
    amount: number
  }
}

export default function AccountCard({ data }: AccountCardProps) {
  return (
    <div className={styles.border}>
      <div>{data.accountName}</div>
      <div>{data.accountNo}</div>
      <div>{data.amount}</div>
    </div>
  )
}
