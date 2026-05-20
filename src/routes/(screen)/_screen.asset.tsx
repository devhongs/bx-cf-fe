import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(screen)/_screen/asset')({
  component: ScreenAssetComponent,
})

function ScreenAssetComponent() {
  return <div>ScreenAsset</div>
}
