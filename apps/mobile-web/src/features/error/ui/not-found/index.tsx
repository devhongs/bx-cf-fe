import { Link } from '@tanstack/react-router';

import styles from './index.module.css';

export function NotFound() {
  return (
    <div className={styles.root}>
      <div className={styles.emoji}>😵</div>
      <div>
        <h1 className={styles.code}>404</h1>
        <h2 className={styles.title}>앗! 페이지가 없어요</h2>
      </div>
      <p className={styles.description}>
        요청하신 페이지를 찾을 수 없어요. 주소를 다시 확인해주세요!
      </p>
      <Link to="/" className={styles.homeLink}>
        홈으로 가기
      </Link>
    </div>
  );
}
