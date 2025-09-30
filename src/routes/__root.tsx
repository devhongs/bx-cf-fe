import { ModalWrapper } from '@/shared/ui/components/modal/modal-wrapper'
import { Outlet, createRootRoute } from '@tanstack/react-router'

export const Route = createRootRoute({
  notFoundComponent: () => <div>404</div>,
  component: () => (
    <>
      <Outlet />
      <ModalWrapper />
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
