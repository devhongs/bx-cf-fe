import { createFileRoute } from '@tanstack/react-router'

import AssetList from '@/features/asset/ui/asset-list'

export const Route = createFileRoute('/_page/asset/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <AssetList />
}
