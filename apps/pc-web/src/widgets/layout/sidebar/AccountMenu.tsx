import { Popover, PopoverClose, PopoverTrigger, useAuthStore, useTheme } from '@bx/shared';
import { useNavigate } from '@tanstack/react-router';
import { Moon, Sun, User } from 'lucide-react';

import { LogoutButton } from '@/features/auth/ui/logout-button';
import { PopoverPanel } from '@/shared/ui/popover-panel/PopoverPanel';

import styles from './AccountMenu.module.css';

const THEME_META = {
  light: { label: '라이트', icon: Sun, next: 'dark' },
  dark: { label: '다크', icon: Moon, next: 'light' },
} as const;

/** 사이드바 하단 프로필 — 클릭 시 계정 팝오버(설정 / 로그아웃 / 테마) */
export function AccountMenu() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { theme, setTheme } = useTheme();
  const { label: themeLabel, icon: ThemeIcon, next: nextTheme } = THEME_META[theme];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button type="button" className={styles.bottomArea}>
          <div className={styles.profile}>
            <div className={styles.avatar}>
              <User size={16} />
            </div>
            <div className={styles.profileInfo}>
              <span className={styles.profileName}>{user?.usrNm ?? '사용자'}</span>
              <span className={styles.profileId}>{user?.usrId ?? ''}</span>
            </div>
          </div>
        </button>
      </PopoverTrigger>
      <PopoverPanel title="계정" side="top" align="start">
        <PopoverClose asChild>
          <button
            type="button"
            className={styles.menuItem}
            onClick={() => navigate({ to: '/setting' as any })}
          >
            <span>설정</span>
          </button>
        </PopoverClose>
        <LogoutButton />

        {/* 테마 — 클릭 시 라이트 → 다크 → 시스템 순환 */}
        <button
          type="button"
          className={styles.menuItem}
          aria-label={`테마 변경 (현재: ${themeLabel})`}
          onClick={() => setTheme(nextTheme)}
        >
          <ThemeIcon size={13} />
          <span>테마: {themeLabel}</span>
        </button>

        {/* 약관 / 정책 */}
        <div className={styles.footer}>
          <button type="button" className={styles.footerLink}>
            개인정보처리방침
          </button>
          <span className={styles.footerDot}>·</span>
          <button type="button" className={styles.footerLink}>
            서비스 약관
          </button>
        </div>
      </PopoverPanel>
    </Popover>
  );
}
