import { Search, Sparkles } from 'lucide-react';
import { useRef } from 'react';

interface AiSearchCardProps {
  onClick?: () => void;
}

export function AiSearchCard({ onClick }: AiSearchCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCardClick = () => {
    inputRef.current?.focus();
    onClick?.();
  };

  return (
    <div
      onClick={handleCardClick}
      className="relative w-full max-w-[340px] h-[180px] bg-white border-[3px] border-solid border-[#ff8c00] rounded-[40px] p-[20px] text-left flex flex-col justify-start transition-all duration-300 group cursor-text"
    >
      {/* 좌측 상단 본문 입력 영역 */}
      <div className="mt-4 ml-3 pr-12 w-full">
        <input
          ref={inputRef}
          type="text"
          placeholder="무엇이든 물어보세요..."
          className="text-[#5c5850] text-[18px] font-light leading-snug tracking-wide font-serif bg-transparent border-none outline-none w-full placeholder:text-[#5c5850]/50"
        />
      </div>

      {/* 우측 상단 고정 돋보기 아이콘 */}
      <div className="absolute top-[18px] right-[18px]">
        <Search className="w-6 h-6 text-[#5c5850] stroke-[1.5] transition-transform duration-300 group-hover:scale-110" />
      </div>

      {/* 우측 하단 고정 반짝이 데코레이션 */}
      <div className="absolute bottom-[18px] right-[18px]">
        <Sparkles className="w-7 h-7 text-[#a69e90] fill-[#a69e90]/10 stroke-[1.2] animate-pulse" />
      </div>
    </div>
  );
}
