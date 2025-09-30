export interface AccountListProps {
  userId?: number
}

export function AccountList({ userId = 1 }: AccountListProps) {
  return <div className="p-4">{userId}</div>
}
