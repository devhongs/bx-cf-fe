import { Outlet, createFileRoute } from '@tanstack/react-router'

import { Footer } from '@/widgets/layout/footer/Footer'
import { Header } from '@/widgets/layout/header/Header'

export const Route = createFileRoute('/_page')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <Header />
      <main className="flex-1 overflow-auto">
        <div>page</div>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
