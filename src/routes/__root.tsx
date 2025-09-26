import '@/shared/styles/common_ui.css'
import { Outlet, createRootRoute } from '@tanstack/react-router'

export const Route = createRootRoute({
  notFoundComponent: () => <div>404</div>,
  component: () => (
    <>
      <Outlet />
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
