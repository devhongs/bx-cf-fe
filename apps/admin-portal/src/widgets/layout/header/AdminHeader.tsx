import { useNavigate } from '@tanstack/react-router';
import { LogOut, Moon, Search, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

import { useAuthStore, useLogout } from '@bx/shared';

import styles from './AdminHeader.module.css';

interface AdminHeaderProps {
  title: string;
}

export function AdminHeader({ title }: AdminHeaderProps) {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logoutMutation = useLogout({
    onSettled: () => {
      navigate({ to: '/login' });
    },
  });
  const [theme, setTheme] = useState<'dark' | 'light'>(
    () => (document.documentElement.dataset.adminTheme as 'dark' | 'light') || 'dark',
  );

  useEffect(() => {
    document.documentElement.dataset.adminTheme = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  };

  return (
    <header className={styles.header}>
      <div className={styles.titleArea}>
        <span className={styles.eyebrow}>ADMIN PORTAL</span>
        <h1>{title}</h1>
      </div>

      <div className={styles.searchBox}>
        <Search size={16} />
        <input aria-label="관리자 통합 검색" placeholder="메뉴, 코드, 사용자 검색" />
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.iconButton}
          onClick={toggleTheme}
          title={theme === 'dark' ? '라이트 테마' : '다크 테마'}
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>
        <div className={styles.profile}>
          <span>{user?.usrNm || '관리자'}</span>
          <small>{user?.usrId || 'admin'}</small>
        </div>
        <button
          type="button"
          className={styles.iconButton}
          onClick={() => logoutMutation.mutate()}
          title="로그아웃"
        >
          <LogOut size={17} />
        </button>
      </div>
    </header>
  );
}
