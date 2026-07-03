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
        <DialogTitle className="text-[#e3e3e3]">이체</DialogTitle>
        <DialogDescription className="text-[#9aa0a6]">
          빠르고 안전하게 송금하세요.
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-[#9aa0a6]">계좌번호</label>
          <input
            type="text"
            className="w-full rounded-lg bg-[#2d2e30] px-4 py-3 text-sm text-[#e3e3e3] placeholder:text-[#9aa0a6] focus:outline-none focus:ring-1 focus:ring-[#8ab4f8]"
            placeholder="받는 분 계좌번호"
            value={accountNo}
            onChange={(e) => setAccountNo(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-[#9aa0a6]">이체 금액</label>
          <input
            type="text"
            inputMode="numeric"
            className="w-full rounded-lg bg-[#2d2e30] px-4 py-3 text-sm text-[#e3e3e3] placeholder:text-[#9aa0a6] focus:outline-none focus:ring-1 focus:ring-[#8ab4f8]"
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
          className="flex-1 rounded-lg bg-[#2d2e30] py-3 text-sm font-medium text-[#9aa0a6] transition-colors hover:bg-[#35363a]"
        >
          취소
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!amount || !accountNo}
          className="flex-1 rounded-lg bg-[#8ab4f8] py-3 text-sm font-medium text-[#131314] transition-opacity disabled:opacity-40"
        >
          이체하기
        </button>
      </div>
    </div>
  );
}
