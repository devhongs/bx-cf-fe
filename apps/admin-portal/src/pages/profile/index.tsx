import { useAuthStore } from '@bx/shared';

import styles from './index.module.css';

export function ProfilePage() {
  const user = useAuthStore((state) => state.user);

  return (
    <section className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h2>프로필</h2>
          <p>관리자 계정 기본 정보와 비밀번호 변경 영역입니다.</p>
        </div>
      </div>

      <section className={styles.section}>
        <div className={styles.fieldGrid}>
          <label className={styles.field}>
            <span>아이디</span>
            <input value={user?.usrId || 'admin'} readOnly />
          </label>
          <label className={styles.field}>
            <span>이름</span>
            <input value={user?.usrNm || '관리자'} readOnly />
          </label>
          <label className={styles.field}>
            <span>부서</span>
            <input value={user?.deptName || '운영'} readOnly />
          </label>
          <label className={styles.field}>
            <span>직책</span>
            <input value={user?.positDivName || '관리자'} readOnly />
          </label>
          <label className={styles.field}>
            <span>현재 비밀번호</span>
            <input type="password" placeholder="현재 비밀번호" />
          </label>
          <label className={styles.field}>
            <span>새 비밀번호</span>
            <input type="password" placeholder="새 비밀번호" />
          </label>
        </div>
        <div className={styles.profileActions}>
          <button type="button" className={styles.button}>
            비밀번호 변경
          </button>
        </div>
      </section>
    </section>
  );
}
