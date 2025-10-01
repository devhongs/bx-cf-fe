import { Modal, ModalBody, ModalTitle } from '@/shared/ui/modal/Modal'

interface AccountListProps {
  userId?: number
}

export default function AccountList({ userId = 1 }: AccountListProps) {
  return (
    <Modal>
      <ModalTitle>계정 목록</ModalTitle>
      <ModalBody>계좌목록...</ModalBody>
    </Modal>
  )
}
