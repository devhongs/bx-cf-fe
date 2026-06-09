import { Outlet, createRootRoute } from '@tanstack/react-router';

import { ModalProvider } from '@/app/providers/modal';

export const Route = createRootRoute({
  notFoundComponent: () => (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      color: '#e3e3e3',
      fontSize: '1.5rem',
    }}>
      404 — 페이지를 찾을 수 없습니다.
    </div>
  ),
  component: () => (
    <>
      <Outlet />
      <ModalProvider />
    </>
  ),
});
