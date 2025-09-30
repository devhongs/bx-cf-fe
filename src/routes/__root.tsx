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
