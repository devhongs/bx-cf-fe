import { useNavigate } from '@tanstack/react-router';
import { LogOut } from 'lucide-react';

import { useUserStore } from '@bx/shared';
import { useModal } from '@bx/shared';
import type { ModalConfig } from '@bx/shared';
import { IconButton } from '@bx/shared';
import { Modal } from '@bx/shared';

interface SettingModalProps extends ModalConfig {
  dummy?: any;
}

export function SettingModal(_props: SettingModalProps) {
  const navigate = useNavigate();
  const { closeAll: closeAllModal } = useModal();
  const logout = useUserStore((state) => state.logout);

  const handleLogoutClick = () => {
    logout();
    navigate({ to: '/login' });
    closeAllModal();
  };

  return (
    <Modal closeButtonType="close">
      <Modal.Title>설정</Modal.Title>
      <Modal.Body>
        <div>
          <IconButton size="lg" icon={LogOut} label="로그아웃" onClick={handleLogoutClick} />
        </div>
      </Modal.Body>
    </Modal>
  );
}

