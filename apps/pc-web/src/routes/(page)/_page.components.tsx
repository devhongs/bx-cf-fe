import { createFileRoute } from '@tanstack/react-router';

import { ComponentsPage } from '@/pages/components';

export const Route = createFileRoute('/(page)/_page/components')({
  component: ComponentsPage,
});
