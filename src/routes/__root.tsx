import { Outlet, createRootRoute } from '@tanstack/react-router';

import NotFound from '@/features/error/ui/not-found';
import { ModalWrapper } from '@/shared/ui/modal/ModalWrapper';

export const Route = createRootRoute({
  notFoundComponent: () => <NotFound />,
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
});
