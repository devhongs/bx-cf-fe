import { createFileRoute } from '@tanstack/react-router'

import AssetPage from '@/pages/page/asset'

export const Route = createFileRoute('/(page)/_page/asset')({
  component: AssetPage,
})
