import { Outlet, createRootRoute } from '@tanstack/react-router';

import { NotFound } from '@/features/error/ui/not-found';
import { ModalProvider } from '@/app/providers/modal/ModalProvider';

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

