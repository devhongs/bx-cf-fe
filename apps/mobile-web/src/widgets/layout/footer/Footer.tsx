import { useLocation, useRouter } from '@tanstack/react-router';
import { Ellipsis, House, SquareChartGantt, WalletMinimal } from 'lucide-react';

import type { BaseProps } from '@bx/shared';
import { cn } from '@bx/shared';
import { FooterButton } from './FooterButton';

import styles from './Footer.module.css';

interface FooterProps extends BaseProps {}

export function Footer(props: FooterProps) {
  const { navigate } = useRouter();
  const location = useLocation();

  const buttons = footerMeta.map((d) => (
    <FooterButton
      key={d.path}
      label={d.label}
      icon={d.icon}
      isSelected={d.path === location.pathname}
      onClick={() => handleClickButton(d.path)}
    />
  ));

  const handleClickButton = (path: string) => {
    // TODO: zustand 통해서 라우팅 되게 수정
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    navigate({ to: path as any });
  };

  return (
    <footer className={cn(styles.root, props.className)}>
      <div className={styles.buttonWrapper}>{buttons}</div>
    </footer>
  );
}

const footerMeta = [
  { label: '홈', path: '/main', icon: <House /> },
  { label: '자산', path: '/asset', icon: <WalletMinimal /> },
  { label: '상품', path: '/product', icon: <SquareChartGantt /> },
  { label: '메뉴', path: '/menu', icon: <Ellipsis /> },
];
