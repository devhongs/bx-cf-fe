import { createFileRoute } from '@tanstack/react-router';

import { DashboardPage } from '@/pages/dashboard';

export const Route = createFileRoute('/(page)/_page/dashboard')({
  component: DashboardPage,
});
