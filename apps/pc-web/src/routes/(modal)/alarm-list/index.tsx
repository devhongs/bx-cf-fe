import { Bell } from 'lucide-react';

import { DialogHeader, DialogTitle } from '@bx/shared';
import type { ModalConfig } from '@bx/shared';

export function AlarmListModal(_props: ModalConfig) {
  return (
    <div className="flex flex-col gap-4">
      <DialogHeader>
        <DialogTitle className="text-foreground">알림</DialogTitle>
      </DialogHeader>

      {/* TODO: useFetchAlarmList 연결 */}
      <div className="flex flex-col items-center justify-center gap-2 py-10 text-muted">
        <Bell size={32} className="opacity-40" />
        <p className="text-sm">새로운 알림이 없습니다.</p>
      </div>
    </div>
  );
}
