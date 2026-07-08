import { Outlet, createRootRoute } from '@tanstack/react-router';

export const Route = createRootRoute({
  notFoundComponent: () => (
    <div className="flex h-screen items-center justify-center bg-background text-foreground">
      404 - 페이지를 찾을 수 없습니다.
    </div>
  ),
  component: () => <Outlet />,
});
