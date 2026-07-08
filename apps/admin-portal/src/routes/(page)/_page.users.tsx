import { createFileRoute } from '@tanstack/react-router';

import { UsersPage } from '@/pages/users';

export const Route = createFileRoute('/(page)/_page/users')({
  component: UsersPage,
});
