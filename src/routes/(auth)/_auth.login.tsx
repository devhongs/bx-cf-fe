import { createFileRoute } from '@tanstack/react-router';

import { LoginPage } from '@/pages/page/login';

export const Route = createFileRoute('/(auth)/_auth/login')({
  component: LoginPage,
});
