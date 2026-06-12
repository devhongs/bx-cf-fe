import { createFileRoute } from '@tanstack/react-router';

import { AlarmPage } from '@/pages/alarm';

export const Route = createFileRoute('/(page)/_page/alarm')({
  component: AlarmPage,
});
