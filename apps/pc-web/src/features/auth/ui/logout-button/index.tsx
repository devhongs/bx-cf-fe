import { useNavigate } from '@tanstack/react-router';

import { useAuthStore } from '@bx/shared';

import styles from './index.module.css';

export function LogoutButton() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate({ to: '/login' });
  };

  return (
    <button type="button" className={styles.button} onClick={handleLogout}>
      <span>로그아웃</span>
    </button>
  );
}
