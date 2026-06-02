import { requireAuth } from '@/shared/guards';
import { Footer } from '@/widgets/layout/footer/Footer';
import { Header } from '@/widgets/layout/header/Header';
import { Outlet, createFileRoute } from '@tanstack/react-router';

function PageLayout() {
  return (
    <div className="min-h-dvh bg-[#fafafa]">
      <Header className="fixed inset-x-0 top-0 h-16 bg-[#f5f5f5] z-10" />
      <main className="fixed inset-x-0 top-16 bottom-16 overflow-y-auto bg-[#fafafa] p-4">
        <Outlet />
      </main>
      <Footer className="fixed inset-x-0 bottom-0 h-16 bg-[#f5f5f5] z-10 border-t border-gray-300" />
    </div>
  );
}

export const Route = createFileRoute('/(page)/_page')({
  component: RouteComponent,
  beforeLoad: requireAuth,
});

function RouteComponent() {
  return <PageLayout />;
}
