import { createFileRoute } from '@tanstack/react-router'

import MenuPage from '@/pages/page/menu'

export const Route = createFileRoute('/(page)/_page/menu')({
  component: MenuPage,
})
