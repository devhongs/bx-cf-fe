import { Link } from '@tanstack/react-router';

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-100 to-blue-100 px-6 text-center gap-4">
      <div className="text-6xl mb-4">😵</div>
      <div>
        <h1 className="text-4xl font-bold text-pink-600 mb-2">404</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">앗! 페이지가 없어요</h2>
      </div>
      <p className="text-gray-600 mb-6" style={{ paddingBottom: '20px' }}>
        요청하신 페이지를 찾을 수 없어요. 주소를 다시 확인해주세요!
      </p>
      <Link
        to="/"
        className="inline-block rounded-full text-base font-extrabold transition bg-pink-500"
        style={{ color: '#fff', padding: '12px' }}
      >
        홈으로 가기
      </Link>
    </div>
  );
}
