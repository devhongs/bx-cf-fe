import { Search } from 'lucide-react';
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
      className="relative w-full max-w-[340px] h-[180px] bg-white/20 backdrop-blur-xl border-[3px] border-[#ff8c00] rounded-[40px] p-5 !flex !justify-between !items-center transition-all duration-300 group cursor-text"
    >
      {/* 좌측 입력 영역 */}
      <div className="!flex-1">
        <input
          ref={inputRef}
          type="text"
          placeholder="무엇이든 물어보세요..."
          className="text-[#5c5850] text-[18px] font-light leading-snug tracking-wide font-serif bg-transparent border-none outline-none w-full placeholder:text-[#5c5850]/50"
        />
      </div>

      {/* 우측 돋보기 아이콘 (absolute 제거, flex 수직 중앙 정렬 강제) */}
      <div className="!flex-shrink-0 ml-4">
        <Search className="w-6 h-6 text-[#5c5850] stroke-[1.5] transition-transform duration-300 group-hover:scale-110" />
      </div>
    </div>
  );
}
