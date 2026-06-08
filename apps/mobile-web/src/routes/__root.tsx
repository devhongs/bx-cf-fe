import { Outlet, createRootRoute } from '@tanstack/react-router';

import { ModalProvider } from '@/app/providers/modal/ModalProvider';
import { NotFound } from '@/features/error/ui/not-found';

export const Route = createRootRoute({
  notFoundComponent: () => <NotFound />,
  component: () => (
    <>
      <Outlet />
      <ModalProvider />
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
});
