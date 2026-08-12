import { hasValidAccessSession } from '@bx/shared';
import { createFileRoute, Navigate } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: () => <Navigate to={hasValidAccessSession() ? '/dashboard' : '/login'} />,
});
