import { Outlet, createFileRoute, useLocation } from '@tanstack/react-router';
import { Menu, PanelRightOpen } from 'lucide-react';

import { createBaseInfoMenuCacheScope, ensureBaseInfoBootstrapped, useAuthStore } from '@bx/shared';

import { queryClient } from '@/queryClient';
import { LayoutProvider, useLayout } from '@/shared/context/LayoutContext';
import { requireAuth } from '@/shared/guards/requireAuth';
import { SettingsPanel } from '@/widgets/layout/panel';
import { NavSidebar } from '@/widgets/layout/sidebar';

import styles from './_page.module.css';

const ROUTE_TITLES: Record<string, string> = {
  '/main': '대시보드',
  '/product': '상품',
  '/asset': '자산',
  '/alarm': '알림',
  '/form': 'Form',
  '/components': 'Components',
  '/setting': '설정',
};

function FoldIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" y1="6" x2="14" y2="6" />
      <line x1="4" y1="12" x2="14" y2="12" />
      <line x1="4" y1="18" x2="14" y2="18" />
      <polyline points="19 17 15 12 19 7" />
    </svg>
  );
}

function PageLayoutContent() {
  const location = useLocation();
  const { navSidebarOpen, toggleNavSidebar, settingsPanelOpen, toggleSettingsPanel } = useLayout();

  const title = ROUTE_TITLES[location.pathname] || '대시보드';

  return (
    <div className={styles.root}>
      <NavSidebar />
      <div className={styles.shell}>
        {/* Global Header */}
        <header className={styles.header}>
          <div className={styles.headerGroup}>
            <button
              type="button"
              className={styles.panelButton}
              onClick={toggleNavSidebar}
              title={navSidebarOpen ? '사이드바 접기' : '사이드바 펴기'}
            >
              {navSidebarOpen ? <FoldIcon size={18} /> : <Menu size={18} />}
            </button>
            <span className={styles.title}>{title}</span>
          </div>

          <div>
            {!settingsPanelOpen && (
              <button
                type="button"
                className={styles.panelButton}
                onClick={toggleSettingsPanel}
                title="우측 패널 펴기"
              >
                <PanelRightOpen size={18} />
              </button>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
      <SettingsPanel />
    </div>
  );
}

function PageLayout() {
  return (
    <LayoutProvider>
      <PageLayoutContent />
    </LayoutProvider>
  );
}

const loadAuthenticatedPage = async (args: any) => {
  const context = await requireAuth(args);
  const userId = useAuthStore.getState().user!.usrId;
  const menuCacheScope = createBaseInfoMenuCacheScope('pc', userId);

  await ensureBaseInfoBootstrapped(queryClient, { menuCacheScope });

  return context;
};

export const Route = createFileRoute('/(page)/_page')({
  beforeLoad: loadAuthenticatedPage,
  component: PageLayout,
});
