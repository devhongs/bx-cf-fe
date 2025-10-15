import { Outlet, createRootRoute } from '@tanstack/react-router'

import { ModalWrapper } from '@/shared/ui/modal/ModalWrapper'

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
