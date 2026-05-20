import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(modal)/_modal/transfer-list')({
  component: TransferListModalRoute,
})

function TransferListModalRoute() {
  return <div>TransferListModal</div>
}
