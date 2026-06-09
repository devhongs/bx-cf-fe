import { User } from 'lucide-react';

import { DialogTitle, DialogHeader, useUserStore } from '@bx/shared';
import type { ModalConfig } from '@bx/shared';

export function UserInfoModal(_props: ModalConfig) {
  const user = useUserStore((s) => s.user);

  return (
    <div className="flex flex-col gap-6">
      <DialogHeader>
        <DialogTitle className="text-[#e3e3e3]">내 정보</DialogTitle>
      </DialogHeader>

      <div className="flex flex-col items-center gap-3 py-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#35363a]">
          <User size={28} className="text-[#8ab4f8]" />
        </div>
        <div className="text-center">
          <p className="text-base font-semibold text-[#e3e3e3]">{user?.name ?? '사용자'}</p>
          <p className="text-sm text-[#9aa0a6]">{user?.id ?? ''}</p>
        </div>
      </div>

      {/* TODO: 상세 정보 섹션 연결 */}
      <div className="rounded-lg bg-[#2d2e30] p-4">
        <p className="text-sm text-[#9aa0a6]">상세 정보 준비 중입니다.</p>
      </div>
    </div>
  );
}
