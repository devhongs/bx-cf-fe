import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(screen)/_screen/main')({
  component: ScreenMainComponent,
})

function ScreenMainComponent() {
  return <div>ScreenMain</div>
}
