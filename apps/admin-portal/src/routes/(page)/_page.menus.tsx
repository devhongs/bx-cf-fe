import { createFileRoute } from '@tanstack/react-router';

import { MenusPage } from '@/pages/menus';

export const Route = createFileRoute('/(page)/_page/menus')({
  component: MenusPage,
});
