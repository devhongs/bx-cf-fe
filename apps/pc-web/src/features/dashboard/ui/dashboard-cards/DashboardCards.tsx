import { useNavigate } from '@tanstack/react-router';
import { ArrowLeftRight, Bell, Settings, ShoppingBag, Star, Wallet } from 'lucide-react';

import styles from './DashboardCards.module.css';

const cards = [
  {
    icon: <Star size={16} />,
    title: '주요 서비스',
    desc: '자주 사용하는 서비스를 한눈에 확인하세요.',
    accentClassName: styles.serviceAccent,
    path: '/main',
  },
  {
    icon: <Wallet size={16} />,
    title: '자산 조회',
    desc: '보유 계좌와 잔액을 실시간으로 확인합니다.',
    accentClassName: styles.assetAccent,
    path: '/asset',
  },
  {
    icon: <ArrowLeftRight size={16} />,
    title: '이체',
    desc: '빠르고 안전하게 송금을 처리하세요.',
    accentClassName: styles.transferAccent,
    path: '/transfer',
  },
  {
    icon: <Bell size={16} />,
    title: '알림',
    desc: '거래 내역 및 중요 안내를 확인합니다.',
    accentClassName: styles.alarmAccent,
    path: '/alarm',
  },
  {
    icon: <ShoppingBag size={16} />,
    title: '금융 상품',
    desc: '예금, 적금, 카드 등 다양한 상품을 탐색합니다.',
    accentClassName: styles.productAccent,
    path: '/product',
  },
  {
    icon: <Settings size={16} />,
    title: '설정',
    desc: '계정 정보 및 앱 환경을 설정합니다.',
    accentClassName: styles.settingsAccent,
    path: '/setting',
  },
];

export function DashboardCards() {
  const navigate = useNavigate();

  return (
    <div className={styles.grid}>
      {cards.map((card) => (
        <button
          key={card.title}
          type="button"
          className={styles.card}
          onClick={() => navigate({ to: card.path as any })}
        >
          <div className={styles.cardHeader}>
            <div className={`${styles.iconWrapper} ${card.accentClassName}`}>{card.icon}</div>
            <h3 className={styles.cardTitle}>{card.title}</h3>
          </div>
          <p className={styles.cardDesc}>{card.desc}</p>
        </button>
      ))}
    </div>
  );
}
