import { createFileRoute } from '@tanstack/react-router'

import ScreenMenu from '@/pages/page/menu'

export const Route = createFileRoute('/(screen)/_screen/menu')({
  component: ScreenMenu,
})
