import { redirect } from '@tanstack/react-router';

import { STORAGE_KEYS } from '../constants';
import { session } from '../lib/utils';

export const requireAuth = ({ location, context }: any) => {
  const isLoggedIn = checkLogin();
  if (!isLoggedIn) {
    throw redirect({
      to: '/login',
      search: { redirect: location.href },
    });
  }
  return { ...context, state: location?.state };
};

const checkLogin = (): boolean => {
  const sessionId = session.get(STORAGE_KEYS.SESSION_ID);
  return !!sessionId;
};
