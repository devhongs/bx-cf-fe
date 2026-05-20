import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(screen)/_screen/product')({
  component: ScreenProductComponent,
})

function ScreenProductComponent() {
  return <div>ScreenProduct</div>
}
