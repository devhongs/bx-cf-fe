import { DashboardCards } from '@/features/dashboard/ui/dashboard-cards';
import { QuickActionBar } from '@/features/dashboard/ui/quick-action-bar';

import styles from './index.module.css';

export function MainPage() {
  return (
    <div className={styles.container}>
      <div className={styles.topNav}>
        <span className={styles.pageTitle}>대시보드</span>
      </div>

      <div className={styles.content}>
        <h1 className={styles.mainTitle}>금융 서비스 탐색</h1>
        <p className={styles.mainSubtitle}>계좌, 자산, 상품 등 다양한 금융 서비스를 이용하세요.</p>

        <DashboardCards />
      </div>

      <div className={styles.bottomBar}>
        <QuickActionBar />
      </div>
    </div>
  );
}
