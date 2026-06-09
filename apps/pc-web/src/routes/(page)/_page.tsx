import { Outlet, createFileRoute } from '@tanstack/react-router';

import { requireAuth } from '@/shared/guards/requireAuth';
import { LeftSidebar } from '@/widgets/layout/sidebar/LeftSidebar';
import { RightPanel } from '@/widgets/layout/right-panel/RightPanel';

function PageLayout() {
  return (
    <div className="grid grid-cols-[240px_1fr_280px] h-screen overflow-hidden bg-[#131314]">
      <LeftSidebar />
      <main className="h-screen overflow-y-auto bg-[#131314]">
        <Outlet />
      </main>
      <RightPanel />
    </div>
  );
}

export const Route = createFileRoute('/(page)/_page')({
  beforeLoad: requireAuth,
  component: PageLayout,
});
