import { DialogDescription, DialogHeader, DialogTitle } from '@bx/shared';
import type { ModalConfig } from '@bx/shared';

type AccountDetailProps = {
  accountNo?: string;
  bankId?: string;
  name?: string;
};

interface AccountDetailModalProps extends ModalConfig {
  props?: AccountDetailProps;
}

export function AccountDetailModal({ props }: AccountDetailModalProps) {
  const { accountNo = '', name = '' } = props ?? {};

  return (
    <div className="flex flex-col gap-6">
      <DialogHeader>
        <DialogTitle className="text-[#e3e3e3]">계좌 상세</DialogTitle>
        <DialogDescription className="text-[#9aa0a6]">{name}</DialogDescription>
      </DialogHeader>

      <div className="rounded-lg bg-[#2d2e30] p-4">
        <p className="text-xs text-[#9aa0a6]">계좌번호</p>
        <p className="mt-1 text-base font-medium text-[#e3e3e3]">{accountNo}</p>
      </div>

      {/* TODO: 거래내역 등 상세 피처 연결 */}
      <div className="flex h-32 items-center justify-center rounded-lg bg-[#2d2e30]">
        <p className="text-sm text-[#9aa0a6]">거래 내역을 불러오는 중...</p>
      </div>
    </div>
  );
}
