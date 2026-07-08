import { useLocation, useNavigate } from '@tanstack/react-router';
import { Braces, LayoutDashboard, ListTree, UserCog, UserRound } from 'lucide-react';
import type { ReactNode } from 'react';

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
  {
    label: 'ACCOUNT',
    items: [{ label: '프로필', path: '/profile', icon: <UserRound size={17} /> }],
  },
];

export function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (item: NavItem) => {
    navigate({ to: item.path as any });
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

      <div className={styles.status}>
        <span className={styles.statusDot} />
        <span>운영 환경</span>
      </div>
    </aside>
  );
}
