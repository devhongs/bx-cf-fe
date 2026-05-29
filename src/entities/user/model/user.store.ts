import { create } from 'zustand';

import { STORAGE_KEYS } from '@/shared/constants';
import { local } from '@/shared/lib/utils';

interface UserStore {
  userId: string | null;
  userName: string | null;
  isLoggedIn: boolean;
  login: (userId: string) => void;
  logout: () => void;
}

// 새로고침 시에도 세션을 유지하기 위해 localStorage에서 동기적으로 값 로드
const getInitialUserId = (): string | null => {
  try {
    return local.get<string>(STORAGE_KEYS.USER_ID);
  } catch {
    return null;
  }
};

const initialUserId = getInitialUserId();

export const useUserStore = create<UserStore>((set) => ({
  userId: initialUserId,
  userName: initialUserId,
  isLoggedIn: !!initialUserId,
  login: (userId: string) => {
    // 세션 정보 로컬스토리지에 저장 (탭 간 공유 및 새로고침 유지)
    local.set(STORAGE_KEYS.USER_ID, userId);
    local.set(STORAGE_KEYS.SESSION_ID, userId);
    set({
      userId,
      userName: userId,
      isLoggedIn: true,
    });
  },
  logout: () => {
    // 세션 정보 초기화
    local.remove(STORAGE_KEYS.USER_ID);
    local.remove(STORAGE_KEYS.SESSION_ID);
    set({
      userId: null,
      userName: null,
      isLoggedIn: false,
    });
  },
}));

// 브라우저 탭 간 실시간 세션 동기화 (탭간 세션 공유)
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEYS.USER_ID) {
      const newUserId = local.get<string>(STORAGE_KEYS.USER_ID);
      if (newUserId) {
        useUserStore.setState({
          userId: newUserId,
          userName: newUserId,
          isLoggedIn: true,
        });
      } else {
        useUserStore.setState({
          userId: null,
          userName: null,
          isLoggedIn: false,
        });
      }
    }
  });
}
