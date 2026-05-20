import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(modal)/_modal/alarm-list')({
  component: AlarmListModalRoute,
})

function AlarmListModalRoute() {
  return <div>AlarmListModal</div>
}
