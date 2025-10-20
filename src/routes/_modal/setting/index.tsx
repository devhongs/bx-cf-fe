import { useNavigate } from '@tanstack/react-router'
import { LogOut } from 'lucide-react'

import { useModal } from '@/shared/hooks/useModal'
import type { ModalConfig } from '@/shared/types'
import { IconButton } from '@/shared/ui/icon-button/IconButton'
import { Modal, ModalBody, ModalTitle } from '@/shared/ui/modal/Modal'

interface SettingModalProps extends ModalConfig {
  dummy?: any
}

export default function SettingModal(_props: SettingModalProps) {
  const navigate = useNavigate()
  const { closeAll: closeAllModal } = useModal()

  const handleLogoutClick = () => {
    sessionStorage.removeItem('sessionId')
    navigate({ to: '/login' })
    closeAllModal()
  }

  return (
    <Modal closeButtonType="close">
      <ModalTitle>설정</ModalTitle>
      <ModalBody>
        <div>
          <IconButton
            size="lg"
            icon={LogOut}
            label="로그아웃"
            onClick={handleLogoutClick}
          />
        </div>
      </ModalBody>
    </Modal>
  )
}
