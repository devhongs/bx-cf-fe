import { Outlet, createFileRoute } from '@tanstack/react-router';

import { requireAuth } from '@/shared/guards/requireAuth';
import { AdminSidebar } from '@/widgets/layout/sidebar';

import styles from './_page.module.css';

function PageLayout() {
  return (
    <div className={styles.layout}>
      <AdminSidebar />
      <div className={styles.content}>
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/(page)/_page')({
  beforeLoad: requireAuth,
  component: PageLayout,
});
