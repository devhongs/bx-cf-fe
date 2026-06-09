import { useNavigate } from '@tanstack/react-router';
import { Star, Wallet, ArrowLeftRight, Bell, ShoppingBag, Settings } from 'lucide-react';

import styles from './index.module.css';

const cards = [
  {
    icon: <Star size={22} />,
    title: '주요 서비스',
    desc: '자주 사용하는 서비스를 한눈에 확인하세요.',
    color: '#f9ab00',
    path: '/main',
  },
  {
    icon: <Wallet size={22} />,
    title: '자산 조회',
    desc: '보유 계좌와 잔액을 실시간으로 확인합니다.',
    color: '#34a853',
    path: '/asset',
  },
  {
    icon: <ArrowLeftRight size={22} />,
    title: '이체',
    desc: '빠르고 안전하게 송금을 처리하세요.',
    color: '#4285f4',
    path: '/transfer',
  },
  {
    icon: <Bell size={22} />,
    title: '알림',
    desc: '거래 내역 및 중요 안내를 확인합니다.',
    color: '#ea4335',
    path: '/alarm',
  },
  {
    icon: <ShoppingBag size={22} />,
    title: '금융 상품',
    desc: '예금, 적금, 카드 등 다양한 상품을 탐색합니다.',
    color: '#a142f4',
    path: '/product',
  },
  {
    icon: <Settings size={22} />,
    title: '설정',
    desc: '계정 정보 및 앱 환경을 설정합니다.',
    color: '#5f6368',
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
          <div className={styles.iconWrapper} style={{ color: card.color }}>
            {card.icon}
          </div>
          <h3 className={styles.cardTitle}>{card.title}</h3>
          <p className={styles.cardDesc}>{card.desc}</p>
        </button>
      ))}
    </div>
  );
}
