import { create } from 'zustand';

import { STORAGE_KEYS } from '../../../shared/constants';
import { local } from '../../../shared/lib/utils';

import type { AuthTokens, AuthUser, LoginResponse } from './auth.type';
import { tokenStorage } from './token-storage';

interface AuthStore {
  user: AuthUser | null;
  tokens: AuthTokens | null;
  /** 로그인/리프레시 응답으로 인증 상태를 갱신한다. */
  setAuth: (res: LoginResponse) => void;
  /** 로그아웃 — 사용자/토큰 정보를 모두 비운다. */
  logout: () => void;
}

const pickUser = (res: LoginResponse): AuthUser => ({
  usrId: res.usrId,
  usrNm: res.usrNm,
  positDivName: res.positDivName,
  deptName: res.deptName,
  roles: res.roles,
});

const pickTokens = (res: LoginResponse): AuthTokens => ({
  accessToken: res.accessToken,
  accessTokenExpiresAt: res.accessTokenExpiresAt,
  refreshToken: res.refreshToken,
  refreshTokenExpiresAt: res.refreshTokenExpiresAt,
});

export const useAuthStore = create<AuthStore>((set) => {
  // 새로고침 후에도 localStorage에서 복원
  const initialUser = local.get<AuthUser>(STORAGE_KEYS.USER);
  const initialTokens = tokenStorage.get();

  return {
    user: initialUser,
    tokens: initialTokens,
    setAuth: (res: LoginResponse) => {
      const user = pickUser(res);
      const tokens = pickTokens(res);
      // 탭 간 공유 및 새로고침 유지를 위해 localStorage에 저장
      local.set(STORAGE_KEYS.USER, user);
      tokenStorage.set(tokens);
      set({ user, tokens });
    },
    logout: () => {
      local.remove(STORAGE_KEYS.USER);
      tokenStorage.clear();
      set({ user: null, tokens: null });
    },
  };
});

// 브라우저 탭 간 실시간 세션 동기화 (탭간 세션 공유)
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEYS.USER) {
      const newUser = local.get<AuthUser>(STORAGE_KEYS.USER);
      useAuthStore.setState({
        user: newUser,
        tokens: newUser ? tokenStorage.get() : null,
      });
    }
  });
}

// 자주 사용되는 사용자 정보 셀렉터 훅 (Getter)
export const useUserName = () => useAuthStore((state) => state.user?.usrNm || '');
export const useUserId = () => useAuthStore((state) => state.user?.usrId || '');
export const useIsLoggedIn = () => useAuthStore((state) => !!state.user);
