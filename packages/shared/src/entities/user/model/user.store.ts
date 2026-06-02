import { create } from 'zustand';

import type { Auth } from '../../auth';
import { STORAGE_KEYS } from '../../../shared/constants';
import { local } from '../../../shared/lib/utils';

interface UserStore {
  user: Auth | null;
  login: (user: Auth) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>((set) => {
  const initialUser = local.get<Auth>(STORAGE_KEYS.USER);

  return {
    user: initialUser,
    login: (user: Auth) => {
      // 세션 정보 로컬스토리지에 저장 (탭 간 공유 및 새로고침 유지)
      local.set(STORAGE_KEYS.USER, user);
      set({
        user,
      });
    },
    logout: () => {
      // 세션 정보 초기화
      local.remove(STORAGE_KEYS.USER);
      set({
        user: null,
      });
    },
  };
});

// 브라우저 탭 간 실시간 세션 동기화 (탭간 세션 공유)
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEYS.USER) {
      const newUser = local.get<Auth>(STORAGE_KEYS.USER);
      if (newUser) {
        useUserStore.setState({
          user: newUser,
        });
      } else {
        useUserStore.setState({
          user: null,
        });
      }
    }
  });
}

// 자주 사용되는 사용자 정보 커스텀 셀렉터 훅 (Getter)
export const useUserName = () => useUserStore((state) => state.user?.name || '');
export const useUserId = () => useUserStore((state) => state.user?.id?.toString() || '');
export const useIsLoggedIn = () => useUserStore((state) => !!state.user);
