import '@/shared/styles/common_ui.css'
import { Outlet, createRootRoute } from '@tanstack/react-router'

import { Footer } from '@/widgets/layout/footer/Footer'
import { Header } from '@/widgets/layout/header/Header'

export const Route = createRootRoute({
  notFoundComponent: () => <div>404</div>,
  component: () => (
    <>
      <html className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
        <Header />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
        <Footer />
      </html>
      {/* <TanstackDevtools
        config={{
          position: 'bottom-left',
        }}
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      /> */}
    </>
  ),
})

// function AuthRedirect() {
//   const navigate = useNavigate()

//   useEffect(() => {
//     const userId = !sessionStorage.getItem('userid')
//     if (userId) {
//       navigate({ to: '/main' })
//     } else {
//       navigate({ to: '/login' })
//     }
//   }, [navigate])

//   return null
// }
