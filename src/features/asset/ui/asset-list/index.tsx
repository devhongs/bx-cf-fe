import type { Account } from '@/entities/account'
import { useFetchAccounts } from '@/entities/account'
import AccountCard from '@/entities/account/ui/account-card'
import type { BaseProps } from '@/shared/types'

interface AssetListProps extends BaseProps {
  dummy?: any
}

export default function AssetList({ dummy }: AssetListProps) {
  const { data } = useFetchAccounts({ userId: '' })
  const content = data?.content ?? []

  return (
    <div>
      {content.map((d: Account) => (
        <AccountCard data={d} />
      ))}
    </div>
  )
}
