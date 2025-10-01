import AlarmList from '@/features/alarm/ui/alarm-list'
import { type ModalConfig } from '@/shared/types'
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalTitle,
} from '@/shared/ui/modal/Modal'
import { Button } from '@bwg-ds/core'

interface AlarmListModalProps extends ModalConfig {
  accoutNo?: number
}

export default function AlarmListModal({
  accoutNo = 1,
  onClose,
}: AlarmListModalProps) {
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
