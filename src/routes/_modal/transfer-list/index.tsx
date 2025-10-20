import TransferList from '@/features/transfer/ui/transfer-list'
import { Modal, ModalBody, ModalTitle } from '@/shared/ui'

export default function TransferListModal() {
  return (
    <Modal>
      <ModalTitle>이체</ModalTitle>
      <ModalBody>
        <TransferList />
      </ModalBody>
    </Modal>
  )
}
