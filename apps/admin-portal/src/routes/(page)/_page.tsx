import {
  createBaseInfoMenuCacheScope,
  ensureBaseInfoBootstrapped,
  LoadingOverlayBoundary,
  useAuthStore,
} from '@bx/shared';
import { createFileRoute, Outlet } from '@tanstack/react-router';

import { queryClient } from '@/queryClient';
import { requireAuth } from '@/shared/guards/requireAuth';
import { AdminSidebar } from '@/widgets/layout/sidebar';

import styles from './_page.module.css';

function PageLayout() {
  return (
    <div className={styles.layout}>
      <AdminSidebar />
      <LoadingOverlayBoundary className={styles.content}>
        <main className={styles.main}>
          <Outlet />
        </main>
      </LoadingOverlayBoundary>
    </div>
  );
}

const loadAuthenticatedPage = async (args: any) => {
  const context = await requireAuth(args);
  const userId = useAuthStore.getState().user!.usrId;
  const menuCacheScope = createBaseInfoMenuCacheScope('admin', userId);

  await ensureBaseInfoBootstrapped(queryClient, { menuCacheScope });

  return context;
};

export const Route = createFileRoute('/(page)/_page')({
  beforeLoad: loadAuthenticatedPage,
  component: PageLayout,
});
