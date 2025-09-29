/* eslint-disable import/order, simple-import-sort/imports */
// prettier-ignore-file
// @ts-nocheck

// import '@/shared/styles/common_ui.css'

import '@bwg-ds/core/dist/core.css'

import '@/shared/styles/css/common_ui.css'

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
