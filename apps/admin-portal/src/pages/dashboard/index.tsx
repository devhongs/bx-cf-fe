import {
  Activity,
  CheckCircle2,
  Clock3,
  Database,
  ListTree,
  ShieldCheck,
  UsersRound,
} from 'lucide-react';
import type { CSSProperties } from 'react';

import styles from '../admin-page.module.css';

const metrics = [
  { label: '공통코드 그룹', value: '18', detail: '활성 17', icon: Database },
  { label: '등록 메뉴', value: '42', detail: '노출 39', icon: ListTree },
  { label: '관리자 사용자', value: '7', detail: '운영 5', icon: UsersRound },
  { label: '최근 변경', value: '12', detail: '오늘 3', icon: Activity },
];

const statusChips = ['기준정보 정상', '권한 검토 2건', '마지막 동기화 09:40'];

const managementCards = [
  {
    title: '코드 관리 현황',
    description: '공통코드 그룹과 하위 코드 기준정보',
    value: '18개 그룹',
    subValue: '124개 코드',
    progress: 86,
    icon: Database,
    status: '정상',
    items: ['시스템 코드 6', '업무 코드 12', '미사용 그룹 1'],
  },
  {
    title: '메뉴 관리 현황',
    description: '관리자 메뉴 노출과 정렬 상태',
    value: '42개 메뉴',
    subValue: '3단계 깊이',
    progress: 74,
    icon: ListTree,
    status: '점검',
    items: ['노출 메뉴 39', '숨김 메뉴 3', '정렬 변경 1'],
  },
  {
    title: '사용자/권한 현황',
    description: '관리자 계정과 역할 사용 상태',
    value: '7명',
    subValue: '4개 역할',
    progress: 92,
    icon: ShieldCheck,
    status: '정상',
    items: ['운영 관리자 5', '승인 대기 1', '잠금 계정 0'],
  },
];

const changeRows = [
  { type: '코드', target: 'USE_YN', actor: 'admin.ops', time: '오늘 09:40', status: '완료' },
  {
    type: '메뉴',
    target: '관리자 메뉴 정렬',
    actor: 'hongsik.yoo',
    time: '어제 17:12',
    status: '완료',
  },
  {
    type: '사용자',
    target: 'admin.ops',
    actor: 'system.admin',
    time: '어제 15:28',
    status: '완료',
  },
  { type: '권한', target: 'ROLE_MANAGER', actor: 'admin.ops', time: '07-08 10:05', status: '검토' },
];

export function DashboardPage() {
  return (
    <section className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h2>운영 현황</h2>
          <p>기준정보, 메뉴, 사용자/권한 상태와 최근 변경 흐름을 확인합니다.</p>
        </div>
      </div>

      <div className={styles.dashboardGrid}>
        <section className={styles.dashboardSummary} aria-labelledby="dashboard-summary-title">
          <div className={styles.dashboardSummaryCopy}>
            <span className={styles.dashboardEyebrow}>Admin control</span>
            <h3 id="dashboard-summary-title">관리 지표</h3>
            <p>관리 기준정보의 변경량과 운영 상태를 한 화면에서 비교합니다.</p>
            <div className={styles.dashboardChipRow}>
              {statusChips.map((chip) => (
                <span key={chip} className={styles.dashboardChip}>
                  <CheckCircle2 size={13} />
                  {chip}
                </span>
              ))}
            </div>
          </div>

          <div className={styles.dashboardTrend}>
            <div className={styles.dashboardTrendHeader}>
              <span>최근 7일 변경 추이</span>
              <strong>+12</strong>
            </div>
            <svg
              className={styles.dashboardSparkline}
              viewBox="0 0 220 82"
              role="img"
              aria-label="최근 7일 변경 추이"
            >
              <path d="M10 63 L42 51 L74 55 L106 34 L138 40 L170 24 L210 18" />
              <circle cx="210" cy="18" r="4" />
            </svg>
            <div className={styles.dashboardTrendFooter}>
              <span>정상 처리 10</span>
              <span>확인 필요 2</span>
            </div>
          </div>
        </section>

        <div className={styles.dashboardMetricGrid}>
          {metrics.map((metric) => {
            const Icon = metric.icon;

            return (
              <article key={metric.label} className={styles.dashboardMetricCard}>
                <Icon size={18} />
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
                <small>{metric.detail}</small>
              </article>
            );
          })}
        </div>

        <div className={styles.dashboardManagementGrid}>
          {managementCards.map((card) => {
            const Icon = card.icon;

            return (
              <article key={card.title} className={styles.dashboardManagementCard}>
                <div className={styles.dashboardCardHeader}>
                  <span className={styles.dashboardIcon}>
                    <Icon size={18} />
                  </span>
                  <span className={styles.dashboardStatus}>{card.status}</span>
                </div>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
                <div className={styles.dashboardValueRow}>
                  <strong>{card.value}</strong>
                  <span>{card.subValue}</span>
                </div>
                <div
                  className={styles.dashboardProgress}
                  aria-label={`${card.title} 진행률 ${card.progress}%`}
                >
                  <span
                    style={{ '--dashboard-progress': `${card.progress}%` } as CSSProperties}
                  />
                </div>
                <ul className={styles.dashboardMiniList}>
                  {card.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>

        <section className={styles.dashboardTableSection}>
          <div className={styles.dashboardSectionHeader}>
            <div>
              <h3>최근 변경 내역</h3>
              <p>기준정보와 권한 변경 이력을 시간순으로 표시합니다.</p>
            </div>
            <span>
              <Clock3 size={13} />
              오늘 기준
            </span>
          </div>

          <div className={styles.dashboardTableScroll}>
            <table className={styles.dashboardTable} aria-label="최근 변경 내역">
              <thead>
                <tr>
                  <th>유형</th>
                  <th>대상</th>
                  <th>변경자</th>
                  <th>시간</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                {changeRows.map((row) => (
                  <tr key={`${row.type}-${row.target}-${row.time}`}>
                    <td>{row.type}</td>
                    <td>{row.target}</td>
                    <td>{row.actor}</td>
                    <td>{row.time}</td>
                    <td>
                      <span className={styles.dashboardTableStatus}>{row.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </section>
  );
}
