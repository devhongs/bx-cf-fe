import { Outlet, createFileRoute, useLocation } from '@tanstack/react-router';
import { Menu, PanelRightOpen } from 'lucide-react';

import { LayoutProvider, useLayout } from '@/shared/context/LayoutContext';
import { requireAuth } from '@/shared/guards/requireAuth';
import { SettingsPanel } from '@/widgets/layout/panel';
import { NavSidebar } from '@/widgets/layout/sidebar';

const ROUTE_TITLES: Record<string, string> = {
  '/main': '대시보드',
  '/product': '상품',
  '/asset': '자산',
  '/alarm': '알림',
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

  const title = ROUTE_TITLES[location.pathname] || 'Playground';

  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-[#131314]">
      <NavSidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Global Header */}
        <header className="flex items-center justify-between h-14 px-6 border-b border-[#2a2a2c] bg-[#131314] shrink-0">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="flex items-center justify-center w-8 h-8 rounded-lg border-none bg-[#2a2a2d] text-[#c4c7c5] hover:bg-[#3c3d40] hover:text-[#e3e3e3] cursor-pointer transition-colors duration-200"
              onClick={toggleNavSidebar}
              title={navSidebarOpen ? '사이드바 접기' : '사이드바 펴기'}
            >
              {navSidebarOpen ? <FoldIcon size={18} /> : <Menu size={18} />}
            </button>
            <span className="text-sm font-medium text-[#e3e3e3]">{title}</span>
          </div>

          <div>
            {!settingsPanelOpen && (
              <button
                type="button"
                className="flex items-center justify-center w-8 h-8 rounded-lg border-none bg-[#2a2a2d] text-[#c4c7c5] hover:bg-[#3c3d40] hover:text-[#e3e3e3] cursor-pointer transition-colors duration-200"
                onClick={toggleSettingsPanel}
                title="우측 패널 펴기"
              >
                <PanelRightOpen size={18} />
              </button>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-[#131314]">
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

export const Route = createFileRoute('/(page)/_page')({
  beforeLoad: requireAuth,
  component: PageLayout,
});
