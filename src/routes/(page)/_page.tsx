import { createFileRoute } from '@tanstack/react-router';

import { PageLayout } from '@/pages/page/layout';
import { requireAuth } from '@/shared/guards';

export const Route = createFileRoute('/(page)/_page')({
  component: RouteComponent,
  beforeLoad: requireAuth,
});

function RouteComponent() {
  return <PageLayout />;
}
