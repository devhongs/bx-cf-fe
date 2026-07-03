import { useNavigate } from '@tanstack/react-router';
import { LogOut, User } from 'lucide-react';

import { DialogDescription, DialogHeader, DialogTitle, useAuthStore, useModal } from '@bx/shared';
import type { ModalConfig } from '@bx/shared';

export function SettingModal(_props: ModalConfig) {
  const navigate = useNavigate();
  const { closeAll } = useModal();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);

  const handleLogout = () => {
    logout();
    closeAll();
    navigate({ to: '/login' });
  };

  return (
    <div className="flex flex-col gap-6">
      <DialogHeader>
        <DialogTitle className="text-[#e3e3e3]">설정</DialogTitle>
        <DialogDescription className="text-[#9aa0a6]">
          계정 및 앱 설정을 관리합니다.
        </DialogDescription>
      </DialogHeader>

      {/* 계정 정보 */}
      <div className="flex items-center gap-3 rounded-lg bg-[#2d2e30] p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#35363a]">
          <User size={18} className="text-[#8ab4f8]" />
        </div>
        <div>
          <p className="text-sm font-medium text-[#e3e3e3]">{user?.usrNm ?? '사용자'}</p>
          <p className="text-xs text-[#9aa0a6]">{user?.usrId ?? ''}</p>
        </div>
      </div>

      {/* 로그아웃 */}
      <button
        type="button"
        onClick={handleLogout}
        className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-red-400 transition-colors hover:bg-[#2d2e30]"
      >
        <LogOut size={16} />
        <span className="text-sm font-medium">로그아웃</span>
      </button>
    </div>
  );
}
