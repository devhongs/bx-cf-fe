import AlarmDetail from '@/features/alarm/ui/alarm-detail'
import { type ModalConfig } from '@/shared/types'
import { Modal, ModalBody, ModalTitle } from '@/shared/ui/modal/Modal'

interface AlarmDetailModalProps extends ModalConfig {
  dummy?: any
}

export default function AlarmDetailModal({ props }: AlarmDetailModalProps) {
  const { id: alarmId } = props
  return (
    <Modal>
      <ModalTitle>알람 상세</ModalTitle>
      <ModalBody>
        <AlarmDetail alarmId={alarmId} />
      </ModalBody>
    </Modal>
  )
}
