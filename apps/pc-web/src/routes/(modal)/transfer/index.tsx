import { useState } from 'react';

import { DialogDescription, DialogHeader, DialogTitle } from '@bx/shared';
import type { ModalConfig } from '@bx/shared';
import { useModal } from '@bx/shared';

export function TransferModal(_props: ModalConfig) {
  const { close } = useModal();
  const [amount, setAmount] = useState('');
  const [accountNo, setAccountNo] = useState('');

  const handleSubmit = () => {
    // TODO: 이체 API 연결
    close();
  };

  return (
    <div className="flex flex-col gap-6">
      <DialogHeader>
        <DialogTitle className="text-foreground">이체</DialogTitle>
        <DialogDescription className="text-muted">빠르고 안전하게 송금하세요.</DialogDescription>
      </DialogHeader>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted">계좌번호</label>
          <input
            type="text"
            className="w-full rounded-lg bg-surface-raised px-4 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="받는 분 계좌번호"
            value={accountNo}
            onChange={(e) => setAccountNo(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted">이체 금액</label>
          <input
            type="text"
            inputMode="numeric"
            className="w-full rounded-lg bg-surface-raised px-4 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ''))}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => close()}
          className="flex-1 rounded-lg bg-surface-raised py-3 text-sm font-medium text-muted transition-colors hover:bg-surface-hover"
        >
          취소
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!amount || !accountNo}
          className="flex-1 rounded-lg bg-accent py-3 text-sm font-medium text-accent-foreground transition-opacity disabled:opacity-40"
        >
          이체하기
        </button>
      </div>
    </div>
  );
}
