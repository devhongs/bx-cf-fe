import { createFileRoute } from '@tanstack/react-router';
import { AiSearchCard } from '@/features/ai-search';

import styles from './_page.main.module.css';

function MainPage() {
  const handleSearchClick = () => {
    console.log('AI 검색 클릭됨');
    // TODO: 향후 검색 모달 또는 페이지 이동 로직 추가 예정
  };

  return (
    <div className={styles.page}>
      <AiSearchCard onClick={handleSearchClick} />
    </div>
  );
}

export const Route = createFileRoute('/(page)/_page/main')({
  component: MainPage,
});
