import { useLocation, useNavigate } from '@tanstack/react-router';
import { Bell, Blocks, FileText, LayoutDashboard, ShoppingBag, Wallet } from 'lucide-react';
import type { ReactNode } from 'react';

import type { ProductRouteState } from '@/routes/(page)/_page.product';
import { useLayout } from '@/shared/context/LayoutContext';

import { AccountMenu } from './AccountMenu';
import styles from './NavSidebar.module.css';

type NavItem = {
  label: string;
  path: string;
  icon: ReactNode;
  state?: ProductRouteState;
};

type NavGroup = {
  label: string;
  type: 'TITLE';
  children: NavItem[];
};

const navItems: NavGroup[] = [
  {
    label: 'MANAGE',
    type: 'TITLE',
    children: [{ label: '대시보드', path: '/main', icon: <LayoutDashboard size={16} /> }],
  },
  {
    label: 'BANKING',
    type: 'TITLE',
    children: [
      { label: '자산', path: '/asset', icon: <Wallet size={16} /> },
      {
        label: '상품',
        path: '/product',
        icon: <ShoppingBag size={16} />,
        state: { productType: 'financial' } satisfies ProductRouteState,
      },
      { label: '알림', path: '/alarm', icon: <Bell size={16} /> },
    ],
  },
  {
    label: 'PLAYGROUND',
    type: 'TITLE',
    children: [
      {
        label: 'Form',
        path: '/form',
        icon: <FileText size={16} />,
      },
      {
        label: 'Components',
        path: '/components',
        icon: <Blocks size={16} />,
      },
    ],
  },
];

export function NavSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { navSidebarOpen } = useLayout();

  const isActive = (item: NavItem) => {
    return location.pathname === item.path;
  };

  const handleNavigate = (item: NavItem) => {
    const options: any = {
      to: item.path as any,
    };

    if (item.state) {
      options.state = (prev: unknown) => ({ ...(prev as object), ...item.state });
    }

    navigate(options);
  };

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
            fill="var(--foreground)"
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
                  key={`${item.path}:${item.label}`}
                  type="button"
                  className={`${styles.navItem} ${isActive(item) ? styles.active : ''}`}
                  onClick={() => handleNavigate(item)}
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
