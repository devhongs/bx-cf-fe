import { Outlet, createFileRoute, useLocation } from '@tanstack/react-router';

import { requireAuth } from '@/shared/guards/requireAuth';
import { AdminHeader } from '@/widgets/layout/header';
import { AdminSidebar } from '@/widgets/layout/sidebar';

import styles from './_page.module.css';

const ROUTE_TITLES: Record<string, string> = {
  '/dashboard': '대시보드',
  '/codes': '코드관리',
  '/menus': '메뉴관리',
  '/users': '사용자 관리',
  '/profile': '프로필',
};

function PageLayout() {
  const location = useLocation();
  const title = ROUTE_TITLES[location.pathname] || '관리자';

  return (
    <div className={styles.layout}>
      <AdminSidebar />
      <div className={styles.content}>
        <AdminHeader title={title} />
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
