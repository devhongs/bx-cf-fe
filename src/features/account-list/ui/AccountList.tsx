export interface AccountListProps {
  userId: number
}

export function AccountList({ userId }: AccountListProps) {
  return <div>{userId}</div>
}
