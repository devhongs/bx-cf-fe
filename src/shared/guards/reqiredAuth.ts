import { redirect } from '@tanstack/react-router';

import { STORAGE_KEYS } from '../constants';
import { local } from '../lib/utils';

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
  const user = local.get(STORAGE_KEYS.USER);
  return !!user;
};
