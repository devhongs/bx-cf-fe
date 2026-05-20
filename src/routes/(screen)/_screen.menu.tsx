import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(screen)/_screen/menu')({
  component: ScreenMenuComponent,
})

function ScreenMenuComponent() {
  return <div>ScreenMenu</div>
}
