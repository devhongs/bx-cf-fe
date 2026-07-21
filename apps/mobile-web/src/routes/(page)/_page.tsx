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

function PageLayout() {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-[#f9f6f0]">
      {/* Unified premium organic liquid mesh backdrop */}
      <MeshBackground theme="cream" />

      {/* Main layout contents positioned on top */}
      <div className="relative z-10 w-full min-h-dvh flex flex-col">
        <Header className="fixed inset-x-0 top-0 h-16 bg-white/10 backdrop-blur-md z-20 border-b border-white/5" />
        <main className="fixed inset-x-0 top-16 bottom-0 overflow-y-auto p-4 pb-28">
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
