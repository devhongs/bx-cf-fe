import { requireAuth } from '@/shared/guards';
import { Footer } from '@/widgets/layout/footer/Footer';
import { Header } from '@/widgets/layout/header/Header';
import { Outlet, createFileRoute, useLocation } from '@tanstack/react-router';
import { MeshBackground, type MeshBackgroundTheme } from '@bx/shared';

function PageLayout() {
  const location = useLocation();

  // Determine background color theme dynamically based on current route
  const getThemeByPath = (pathname: string): MeshBackgroundTheme => {
    if (pathname.startsWith('/asset')) return 'blue';
    if (pathname.startsWith('/product')) return 'green';
    if (pathname.startsWith('/menu')) return 'slate';
    return 'purple'; // Default home /main theme
  };

  const currentTheme = getThemeByPath(location.pathname);

  return (
    <div className="relative min-h-dvh overflow-hidden bg-[#f5f0f9]">
      {/* Dynamic premium organic liquid mesh backdrop */}
      <MeshBackground theme={currentTheme} />

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

export const Route = createFileRoute('/(page)/_page')({
  component: RouteComponent,
  beforeLoad: requireAuth,
});

function RouteComponent() {
  return <PageLayout />;
}

