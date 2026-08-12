import { createFileRoute } from '@tanstack/react-router';
import { LoginForm } from '@/features/auth';

export const Route = createFileRoute('/(auth)/_auth/login')({
  component: LoginForm,
});
