import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(modal)/_modal/setting-modal')({
  component: SettingModalRoute,
})

function SettingModalRoute() {
  return <div>SettingModal</div>
}
