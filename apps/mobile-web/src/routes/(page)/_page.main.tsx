import { AiSearchCard } from '@/features/ai-search';
import { createFileRoute } from '@tanstack/react-router';

function MainPage() {
  const handleSearchClick = () => {
    console.log('AI 검색 클릭됨');
    // TODO: 향후 검색 모달 또는 페이지 이동 로직 추가 예정
  };

  return (
    <div className="w-full h-[calc(100dvh-176px)] px-4 !flex !flex-col !justify-center !items-center">
      <AiSearchCard onClick={handleSearchClick} />
    </div>
  );
}

export const Route = createFileRoute('/(page)/_page/main')({
  component: MainPage,
});
