import TransferAmount from '@/features/transfer/ui/transfer-amount'
import type { ModalConfig } from '@/shared/types'
import { Modal, ModalBody, ModalTitle } from '@/shared/ui/modal/Modal'

interface TransferAmountModalProps extends ModalConfig {
  dummy?: any
}

export default function TransferAmountModal({
  props,
}: TransferAmountModalProps) {
  const { bankId: bankId, accountNo: accountNo } = props

  return (
    <Modal>
      <ModalTitle>이체</ModalTitle>
      <ModalBody>
        <TransferAmount />
        {bankId} {accountNo}
      </ModalBody>
    </Modal>
  )
}
