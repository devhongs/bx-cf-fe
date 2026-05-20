import { createFileRoute } from '@tanstack/react-router'

import MainPage from '@/pages/page/main'

export const Route = createFileRoute('/(page)/_page/main')({
  component: MainPage,
})
