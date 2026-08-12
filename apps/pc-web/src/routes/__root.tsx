import { createRootRoute, Outlet } from '@tanstack/react-router';

import { ModalProvider } from '@/app/providers/modal';

import styles from './__root.module.css';

export const Route = createRootRoute({
  notFoundComponent: () => <div className={styles.notFound}>404 — 페이지를 찾을 수 없습니다.</div>,
  component: () => (
    <>
      <Outlet />
      <ModalProvider />
    </>
  ),
});
