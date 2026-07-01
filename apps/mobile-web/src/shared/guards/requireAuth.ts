import { redirect } from '@tanstack/react-router';

import { ensureValidAuthSession } from '@bx/shared';

export const requireAuth = async ({ location, context }: any) => {
  const hasValidSession = await ensureValidAuthSession();

  if (!hasValidSession) {
    throw redirect({
      to: '/login',
      search: { redirect: location.href },
    });
  }
  return { ...context, state: location?.state };
};
