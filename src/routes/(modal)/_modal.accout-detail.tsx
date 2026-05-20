import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(modal)/_modal/accout-detail')({
  component: AccountDetailModalRoute,
})

function AccountDetailModalRoute() {
  return <div>AccountDetailModal</div>
}
