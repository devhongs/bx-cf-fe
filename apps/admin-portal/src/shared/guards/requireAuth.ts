import { redirect } from '@tanstack/react-router';

import { ensureValidAuthSession, useAuthStore } from '@bx/shared';

export const requireAuth = async ({ location, context }: any) => {
  const hasValidSession = await ensureValidAuthSession();
  const userId = useAuthStore.getState().user?.usrId;

  if (!hasValidSession || !userId) {
    throw redirect({
      to: '/login',
      search: { redirect: location.href },
    });
  }

  return { ...context, state: location?.state };
};
