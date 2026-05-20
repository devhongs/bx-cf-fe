import AlarmList from '@/features/alarm/ui/alarm-list'
import type { ModalConfig } from '@/shared/types'
import { Button, Modal, ModalBody, ModalFooter, ModalTitle } from '@/shared/ui'

interface AlarmListModalProps extends ModalConfig {}

export default function AlarmListModal({ onClose }: AlarmListModalProps) {
  return (
    <Modal>
      <ModalTitle>알람 리스트</ModalTitle>
      <ModalBody>
        <AlarmList />
      </ModalBody>
      <ModalFooter>
        <Button onClick={() => onClose?.({ data: 'confirm click' })}>
          확인
        </Button>
      </ModalFooter>
    </Modal>
  )
}
