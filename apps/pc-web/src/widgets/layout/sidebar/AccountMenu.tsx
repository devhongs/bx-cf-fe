import { useNavigate } from '@tanstack/react-router';
import { User } from 'lucide-react';

import { Popover, PopoverClose, PopoverTrigger, useAuthStore } from '@bx/shared';

import { LogoutButton } from '@/features/auth/ui/logout-button';
import { PopoverPanel } from '@/shared/ui/popover-panel/PopoverPanel';

import styles from './AccountMenu.module.css';

/** 사이드바 하단 프로필 — 클릭 시 계정 팝오버(설정 / 로그아웃) */
export function AccountMenu() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

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
