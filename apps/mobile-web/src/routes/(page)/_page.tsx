import { Outlet, createFileRoute } from '@tanstack/react-router';

import {
  MeshBackground,
  createBaseInfoMenuCacheScope,
  ensureBaseInfoBootstrapped,
  useAuthStore,
} from '@bx/shared';

import { queryClient } from '@/queryClient';
import { requireAuth } from '@/shared/guards';
import { Footer } from '@/widgets/layout/footer/Footer';
import { Header } from '@/widgets/layout/header/Header';

import styles from './_page.module.css';

function PageLayout() {
  return (
    <div className={styles.page}>
      {/* Unified premium organic liquid mesh backdrop */}
      <MeshBackground theme="cream" />

      {/* Main layout contents positioned on top */}
      <div className={styles.contentLayer}>
        <Header className={styles.header} />
        <main className={styles.main}>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}

const loadAuthenticatedPage = async (args: any) => {
  const context = await requireAuth(args);
  const userId = useAuthStore.getState().user!.usrId;
  const menuCacheScope = createBaseInfoMenuCacheScope('mobile', userId);

  await ensureBaseInfoBootstrapped(queryClient, { menuCacheScope });

  return context;
};

export const Route = createFileRoute('/(page)/_page')({
  component: RouteComponent,
  beforeLoad: loadAuthenticatedPage,
});

function RouteComponent() {
  return <PageLayout />;
}
