export interface AccountDetailProps {
  accoutNo: number
}

export function AccountDetail({ accoutNo }: AccountDetailProps) {
  return <div>{accoutNo}</div>
}
