// import { AccountList } from '@/features/account-list'
import { useLocation } from '@tanstack/react-router';

import { cn } from '@bx/shared';
import type { BaseProps } from '@bx/shared';

import styles from './Header.module.css';
import { HeaderLeft } from './HeaderLeft';
import { HeaderRight } from './HeaderRight';

interface HeaderProps extends BaseProps {}

const PAGE_TITLES: Record<string, string> = {
  '/main': '홈',
  '/asset': '자산',
  '/product': '상품',
  '/menu': '메뉴',
} as const;

export function Header(props: HeaderProps) {
  const location = useLocation();
  const pageTitle = PAGE_TITLES[location.pathname] ?? '홈';

  return (
    <header className={cn(styles.layout, props.className)}>
      <div className={styles.left}>
        <HeaderLeft pageTitle={pageTitle} />
      </div>
      <div className={styles.right}>
        <HeaderRight pageTitle={pageTitle} />
      </div>
    </header>
  );
}
