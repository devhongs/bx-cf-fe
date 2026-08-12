import { useLogout } from '@bx/shared';
import { useNavigate } from '@tanstack/react-router';

import styles from './LogoutButton.module.css';

export function LogoutButton() {
  const navigate = useNavigate();
  const { mutate: logout, isPending } = useLogout({
    onSettled: () => {
      navigate({ to: '/login' });
    },
  });

  const handleLogout = () => {
    logout();
  };

  return (
    <button type="button" className={styles.button} onClick={handleLogout} disabled={isPending}>
      <span>로그아웃</span>
    </button>
  );
}
