import { useLocation, useNavigate } from '@tanstack/react-router';
import { Bell, LayoutDashboard, LogOut, Settings, ShoppingBag, User, Wallet } from 'lucide-react';

import { useAuthStore } from '@bx/shared';

import styles from './LeftSidebar.module.css';

const navItems = [
  { label: '대시보드', path: '/main', icon: <LayoutDashboard size={18} /> },
  { label: '자산', path: '/asset', icon: <Wallet size={18} /> },
  { label: '상품', path: '/product', icon: <ShoppingBag size={18} /> },
  { label: '알림', path: '/alarm', icon: <Bell size={18} /> },
  { label: '설정', path: '/setting', icon: <Settings size={18} /> },
];

export function LeftSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    navigate({ to: '/login' });
  };

  return (
    <aside className={styles.sidebar}>
      {/* 로고 */}
      <div className={styles.logoArea}>
        <div className={styles.logo}>
          <span className={styles.logoText}>BWG</span>
        </div>
        <span className={styles.logoLabel}>Finance</span>
      </div>

      {/* 네비게이션 */}
      <nav className={styles.nav}>
        {navItems.map((item) => (
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
      </nav>

      {/* 하단 프로필 */}
      <div className={styles.bottomArea}>
        <div className={styles.profile}>
          <div className={styles.avatar}>
            <User size={16} />
          </div>
          <div className={styles.profileInfo}>
            <span className={styles.profileName}>{user?.usrNm ?? '사용자'}</span>
            <span className={styles.profileId}>{user?.usrId ?? ''}</span>
          </div>
        </div>
        <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}
