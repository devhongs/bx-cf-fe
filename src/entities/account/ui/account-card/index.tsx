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
    isFavorite: boolean
  }
  onFavoriteSelect?: (accountNo: string) => void
}

export default function AccountCard({
  data,
  onFavoriteSelect,
}: AccountCardProps) {
  const formatAccountNum = formatAccountNumberByBank(
    data.bankId,
    data.accountNo,
  )

  const formatAmount = data.amount.toLocaleString('ko-KR')

  return (
    <div className={styles.card}>
      {/** 계좌 정보*/}
      <div className={styles.accountWrapper}>
        <div className={styles.accountText}>
          <div className={styles.accountName}>{data.accountName}</div>
          <div className={styles.accountNo}>{formatAccountNum}</div>
        </div>

        {/* ⭐ 즐겨찾기 버튼 (오른쪽 상단) */}
        <button
          type="button"
          aria-label="즐겨찾기"
          className={styles.favoriteButton}
          onClick={() => onFavoriteSelect?.(data.accountNo)}
        >
          {data.isFavorite ? '⭐' : '☆'}
        </button>
      </div>

      {/** 금액 */}
      <div className={styles.amountWrapper}>
        <div className={styles.amount}>{formatAmount}원</div>
      </div>

      {/** 거래내역, 이체 버튼 */}
      <div className={styles.buttonWrapper}>
        <button type="button" className={styles.button} aria-label="이체">
          이체
        </button>
        <button type="button" className={styles.button} aria-label="거래내역">
          거래내역
        </button>
      </div>
    </div>
  )
}
