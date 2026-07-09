import { useLocation, useNavigate } from '@tanstack/react-router';
import {
  Braces,
  LayoutDashboard,
  ListTree,
  LogOut,
  Moon,
  Sun,
  UserCog,
  UserRound,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

import {
  Popover,
  PopoverClose,
  PopoverPrimitive,
  PopoverTrigger,
  logout as requestLogout,
  useAuthStore,
} from '@bx/shared';

import styles from './AdminSidebar.module.css';

type NavItem = {
  label: string;
  path: string;
  icon: ReactNode;
};

const navGroups: Array<{ label: string; items: NavItem[] }> = [
  {
    label: 'WORKSPACE',
    items: [{ label: '대시보드', path: '/dashboard', icon: <LayoutDashboard size={17} /> }],
  },
  {
    label: 'SYSTEM',
    items: [
      { label: '코드관리', path: '/codes', icon: <Braces size={17} /> },
      { label: '메뉴관리', path: '/menus', icon: <ListTree size={17} /> },
      { label: '사용자 관리', path: '/users', icon: <UserCog size={17} /> },
    ],
  },
];

export function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.logout);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof document === 'undefined') return 'dark';
    return (document.documentElement.dataset.adminTheme as 'dark' | 'light') || 'dark';
  });

  useEffect(() => {
    document.documentElement.dataset.adminTheme = theme;
  }, [theme]);

  const handleNavigate = (item: NavItem) => {
    navigate({ to: item.path as any });
  };

  const toggleTheme = () => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  };

  const handleLogout = async () => {
    try {
      await requestLogout();
    } finally {
      clearAuth();
      navigate({ to: '/login' });
    }
  };

  return (
    <aside className={styles.sidebar} aria-label="관리자 메뉴">
      <div className={styles.logoArea}>
        <div className={styles.logoMark}>BX</div>
        <div className={styles.logoText}>
          <strong>Admin</strong>
          <span>Backoffice</span>
        </div>
      </div>

      <nav className={styles.nav}>
        {navGroups.map((group) => (
          <section key={group.label} className={styles.group}>
            <div className={styles.groupLabel}>{group.label}</div>
            {group.items.map((item) => {
              const active = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  type="button"
                  className={`${styles.navItem} ${active ? styles.active : ''}`}
                  onClick={() => handleNavigate(item)}
                  title={item.label}
                >
                  <span className={styles.icon}>{item.icon}</span>
                  <span className={styles.label}>{item.label}</span>
                </button>
              );
            })}
          </section>
        ))}
      </nav>

      <Popover>
        <div className={styles.accountArea}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={styles.profileButton}
              aria-label="프로필"
              title="프로필"
            >
              <span className={styles.avatar}>
                <UserRound size={16} />
              </span>
              <span className={styles.profileInfo}>
                <span className={styles.profileName}>{user?.usrNm || '관리자'}</span>
                <span className={styles.profileId}>{user?.usrId || 'admin'}</span>
              </span>
            </button>
          </PopoverTrigger>
        </div>

        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            side="top"
            align="start"
            sideOffset={12}
            className={styles.accountPopover}
          >
            <PopoverClose asChild>
              <button
                type="button"
                className={styles.accountMenuItem}
                aria-label={theme === 'dark' ? '라이트 테마' : '다크 테마'}
                onClick={toggleTheme}
                title={theme === 'dark' ? '라이트 테마' : '다크 테마'}
              >
                {theme === 'dark' ? <Sun size={13} /> : <Moon size={13} />}
                <span>{theme === 'dark' ? '라이트 테마' : '다크 테마'}</span>
              </button>
            </PopoverClose>
            <PopoverClose asChild>
              <button
                type="button"
                className={styles.accountMenuItem}
                aria-label="로그아웃"
                onClick={() => void handleLogout()}
                title="로그아웃"
              >
                <LogOut size={13} />
                <span>로그아웃</span>
              </button>
            </PopoverClose>
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </Popover>
    </aside>
  );
}
