import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(modal)/_modal/transfer-amount')({
  component: TransferAmountModalRoute,
})

function TransferAmountModalRoute() {
  return <div>TransferAmountModal</div>
}
