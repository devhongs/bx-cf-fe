import { useNavigate } from '@tanstack/react-router';
import { LogOut } from 'lucide-react';

import { useUserStore } from '@/entities/user';
import { useModal } from '@/shared/hooks/useModal';
import type { ModalConfig } from '@/shared/types';
import { IconButton } from '@/shared/ui/icon-button/IconButton';
import { Modal } from '@/shared/ui/modal/Modal';

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

