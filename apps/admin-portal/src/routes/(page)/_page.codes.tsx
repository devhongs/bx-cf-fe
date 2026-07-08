import { createFileRoute } from '@tanstack/react-router';

import { CodesPage } from '@/pages/codes';

export const Route = createFileRoute('/(page)/_page/codes')({
  component: CodesPage,
});
