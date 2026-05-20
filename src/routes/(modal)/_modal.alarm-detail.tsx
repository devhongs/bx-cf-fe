import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(modal)/_modal/alarm-detail')({
  component: AlarmDetailModalRoute,
})

function AlarmDetailModalRoute() {
  return <div>AlarmDetailModal</div>
}
