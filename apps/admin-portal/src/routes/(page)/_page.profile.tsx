import { createFileRoute } from '@tanstack/react-router';

import { ProfilePage } from '@/pages/profile';

export const Route = createFileRoute('/(page)/_page/profile')({
  component: ProfilePage,
});
