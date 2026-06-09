import { createFileRoute } from '@tanstack/react-router';

import { LoginForm } from '@/features/auth/ui/login-form';

export const Route = createFileRoute('/(auth)/_auth/login')({
  component: LoginForm,
});
