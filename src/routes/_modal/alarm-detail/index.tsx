import AlarmDetail from '@/features/alarm/ui/alarm-detail'
import { type ModalConfig } from '@/shared/types'
import { Modal, ModalBody, ModalTitle } from '@/shared/ui/modal/Modal'

interface AlarmDetailModalProps extends ModalConfig {
  alarmId?: number
}

export default function AlarmDetailModal({
  alarmId = 1,
}: AlarmDetailModalProps) {
  return (
    <Modal>
      <ModalTitle>알람 상세</ModalTitle>
      <ModalBody>
        <AlarmDetail />
      </ModalBody>
    </Modal>
  )
}
