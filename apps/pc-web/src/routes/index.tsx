import { Navigate, createFileRoute } from '@tanstack/react-router';

import { hasValidAccessSession } from '@bx/shared';

export const Route = createFileRoute('/')({
  component: () => <Navigate to={hasValidAccessSession() ? '/main' : '/login'} />,
});
