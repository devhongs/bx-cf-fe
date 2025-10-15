import type { BaseProps } from '@/shared/types'

import styles from './index.module.css'


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
