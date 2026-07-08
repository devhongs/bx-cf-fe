import { useNavigate } from '@tanstack/react-router';
import { Braces, ListTree, UserCog } from 'lucide-react';

import styles from '../admin-page.module.css';

const metrics = [
  { label: '공통코드 그룹', value: '18' },
  { label: '등록 메뉴', value: '42' },
  { label: '관리자 사용자', value: '7' },
  { label: '최근 변경', value: '12' },
];

const activities = [
  'USE_YN 코드 그룹이 업데이트되었습니다.',
  '관리자 메뉴 정렬 순서가 조정되었습니다.',
  '운영자 계정 admin.ops 상태가 사용으로 변경되었습니다.',
];

export function DashboardPage() {
  const navigate = useNavigate();

  return (
    <section className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h2>운영 현황</h2>
          <p>관리 기준정보와 관리자 사용자 상태를 빠르게 확인합니다.</p>
        </div>
      </div>

      <div className={styles.metricGrid}>
        {metrics.map((metric) => (
          <article key={metric.label} className={styles.metricCard}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
          </article>
        ))}
      </div>

      <div className={styles.workspace}>
        <section className={styles.section}>
          <h3>빠른 작업</h3>
          <div className={styles.fieldGrid}>
            <button type="button" className={styles.ghostButton} onClick={() => navigate({ to: '/codes' })}>
              <Braces size={15} /> 코드관리
            </button>
            <button type="button" className={styles.ghostButton} onClick={() => navigate({ to: '/menus' })}>
              <ListTree size={15} /> 메뉴관리
            </button>
            <button type="button" className={styles.ghostButton} onClick={() => navigate({ to: '/users' })}>
              <UserCog size={15} /> 사용자 관리
            </button>
          </div>
        </section>

        <section className={styles.section}>
          <h3>최근 변경</h3>
          <div className={styles.listPane}>
            {activities.map((activity) => (
              <span key={activity} className={styles.badge}>
                {activity}
              </span>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
