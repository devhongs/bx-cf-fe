import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(screen)/_screen/setting')({
  component: ScreenSettingComponent,
})

function ScreenSettingComponent() {
  return <div>ScreenSetting</div>
}
