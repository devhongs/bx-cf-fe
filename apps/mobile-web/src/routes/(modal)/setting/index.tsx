import { useNavigate } from '@tanstack/react-router';
import { LogOut } from 'lucide-react';

import { useLogout } from '@bx/shared';
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
  const { mutate: logout, isPending } = useLogout({
    onSettled: () => {
      navigate({ to: '/login' });
      closeAllModal();
    },
  });

  const handleLogoutClick = () => {
    logout();
  };

  return (
    <Modal closeButtonType="close">
      <Modal.Title>설정</Modal.Title>
      <Modal.Body>
        <div>
          <IconButton
            size="lg"
            icon={LogOut}
            label="로그아웃"
            onClick={handleLogoutClick}
            disabled={isPending}
          />
        </div>
      </Modal.Body>
    </Modal>
  );
}
