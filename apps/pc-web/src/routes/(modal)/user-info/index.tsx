import { User } from 'lucide-react';

import { DialogHeader, DialogTitle, useAuthStore } from '@bx/shared';
import type { ModalConfig } from '@bx/shared';

export function UserInfoModal(_props: ModalConfig) {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="flex flex-col gap-6">
      <DialogHeader>
        <DialogTitle className="text-foreground">내 정보</DialogTitle>
      </DialogHeader>

      <div className="flex flex-col items-center gap-3 py-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-hover">
          <User size={28} className="text-accent" />
        </div>
        <div className="text-center">
          <p className="text-base font-semibold text-foreground">{user?.usrNm ?? '사용자'}</p>
          <p className="text-sm text-muted">{user?.usrId ?? ''}</p>
        </div>
      </div>

      {/* TODO: 상세 정보 섹션 연결 */}
      <div className="rounded-lg bg-surface-raised p-4">
        <p className="text-sm text-muted">상세 정보 준비 중입니다.</p>
      </div>
    </div>
  );
}
