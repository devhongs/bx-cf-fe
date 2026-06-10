import { redirect } from '@tanstack/react-router';

import { isAuthenticated } from '@bx/shared';

export const requireAuth = ({ location, context }: any) => {
  if (!isAuthenticated()) {
    throw redirect({
      to: '/login',
      search: { redirect: location.href },
    });
  }
  return { ...context, state: location?.state };
};
