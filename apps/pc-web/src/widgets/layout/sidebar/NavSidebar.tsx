import { useLocation, useNavigate } from '@tanstack/react-router';
import { Bell, FlaskConical, LayoutDashboard, ShoppingBag, Wallet } from 'lucide-react';

import { AccountMenu } from './AccountMenu';
import styles from './NavSidebar.module.css';

const navItems = [
  {
    label: 'MANAGE',
    type: 'TITLE',
    children: [
      { label: '대시보드', path: '/main', icon: <LayoutDashboard size={16} /> },
      { label: 'Playground', path: '/playground', icon: <FlaskConical size={16} /> },
    ],
  },
  {
    label: 'PRODUCTS',
    type: 'TITLE',
    children: [
      { label: '자산', path: '/asset', icon: <Wallet size={16} /> },
      { label: '상품', path: '/product', icon: <ShoppingBag size={16} /> },
      { label: '알림', path: '/alarm', icon: <Bell size={16} /> },
    ],
  },
];

import { useLayout } from '@/shared/context/LayoutContext';

export function NavSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { navSidebarOpen } = useLayout();

  return (
    <aside className={`${styles.sidebar} ${!navSidebarOpen ? styles.collapsed : ''}`}>
      {/* 로고 */}
      <div className={styles.logoArea}>
        <svg
          width="150"
          height="24"
          viewBox="0 0 150 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <text
            x="0"
            y="18"
            fill="#FFFFFF"
            fontFamily="'Product Sans', 'Google Sans', 'Outfit', 'Inter', system-ui, sans-serif"
            fontSize="18"
            fontWeight="500"
            letterSpacing="-0.3"
          >
            BWG AI Studio
          </text>
        </svg>
      </div>

      {/* 네비게이션 */}
      <nav className={styles.nav}>
        {navItems.map((group) => (
          <div key={group.label} className={styles.navGroup}>
            <div className={styles.navGroupTitle}>{group.label}</div>
            <div className={styles.navGroupChildren}>
              {group.children?.map((item) => (
                <button
                  key={item.path}
                  type="button"
                  className={`${styles.navItem} ${location.pathname === item.path ? styles.active : ''}`}
                  onClick={() => navigate({ to: item.path as any })}
                >
                  <span className={styles.navIcon}>{item.icon}</span>
                  <span className={styles.navLabel}>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* 하단 프로필 — 계정 메뉴 */}
      <AccountMenu />
    </aside>
  );
}
