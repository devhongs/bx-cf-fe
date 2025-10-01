import { type ModalConfig } from '@/shared/types'
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalTitle,
} from '@/shared/ui/modal/Modal'
import { Button } from '@bwg-ds/core'

interface AccountDetailProps extends ModalConfig {
  accoutNo?: number
}

export default function AccountDetail({
  accoutNo = 1,
  onClose,
}: AccountDetailProps) {
  return (
    <Modal>
      <ModalTitle>알람 리스트</ModalTitle>
      <ModalBody>알람 내용....</ModalBody>
      <ModalFooter>
        <Button onClick={() => onClose?.({ data: 'confirm click' })}>
          확인
        </Button>
      </ModalFooter>
    </Modal>
  )
}
