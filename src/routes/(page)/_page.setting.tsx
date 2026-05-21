import { createFileRoute } from '@tanstack/react-router';

import SettingPage from '@/pages/page/setting';

export const Route = createFileRoute('/(page)/_page/setting')({
  component: SettingPage,
});
