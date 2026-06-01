import { useFetchAccountList } from '@/entities/account';
import type { Account } from '@/entities/account';
import { AccountCard } from '@/entities/account/ui/account-card';
import { createFileRoute } from '@tanstack/react-router';

function MainPage() {
  const { data } = useFetchAccountList({ userId: '1234567890' });
  const content = data ?? [];

  // 즐겨찾기 계좌가 없으면 첫 번째 계좌를 보여주는 안전장치 적용
  const favoriteAccount = content.find((acc: Account) => acc.isFavorite) || content[0];

  console.table(content);

  return (
    <div style={{ padding: '20px' }}>
      {favoriteAccount && <AccountCard data={favoriteAccount} />}
    </div>
  );
}

export const Route = createFileRoute('/(page)/_page/main')({
  component: MainPage,
});
