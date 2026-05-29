import { useEffect, useState } from 'react';

import type { Account } from '@/entities/account';
import { useFetchAccounts, useSetFavoriteAccount } from '@/entities/account';
import { AccountCard } from '@/entities/account/ui/account-card';
import { useModal } from '@/shared/hooks';
import type { BaseProps } from '@/shared/types';

interface AssetListProps extends BaseProps {
  dummy?: any;
}

export function AssetList(_props: AssetListProps) {
  const { data } = useFetchAccounts({ userId: '' });
  const content = data;
  const [accounts, setAccounts] = useState<Array<Account>>([]);

  const { open: openModal } = useModal();

  const setFavorite = useSetFavoriteAccount();

  useEffect(() => {
    if (!content) {
      setAccounts([]);
      return;
    }
    let favIdx = content.findIndex((acc: Account) => acc.isFavorite);
    if (favIdx < 0) favIdx = 0; // 즐겨찾기 계좌가 없으면 첫번째 계좌를 기본으로 설정

    const next = content.map((acc: Account, index: number) => ({
      ...acc,
      isFavorite: index === favIdx,
    }));

    setAccounts((prev) => {
      const same =
        prev.length === next.length &&
        prev.every(
          (p, i) => p.accountNo === next[i].accountNo && p.isFavorite === next[i].isFavorite,
        );
      return same ? prev : next;
    });
  }, [content]);

  // 카드에서 클릭 시
  const handleFavoriteSelect = (acc: Account) => {
    if (acc.isFavorite) return;
    setFavorite.mutate(acc.accountNo);
  };

  const handleTransferClick = (acc: Account) => {
    openModal({
      path: 'transfer-list',
      props: acc,
    });
  };

  return (
    <div>
      {accounts.map((d: Account) => (
        <AccountCard
          key={d.accountNo}
          data={d}
          onFavoriteSelect={() => handleFavoriteSelect(d)}
          onTransferClick={() => handleTransferClick(d)}
        />
      ))}
    </div>
  );
}
