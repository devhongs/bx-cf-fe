import type { ModalConfig } from '@bx/shared';
import { Modal } from '@bx/shared';
import { TransferList } from '@/features/transfer/ui/transfer-list';

interface TransferListModalProps extends ModalConfig {
  dummy?: any;
}

export function TransferListModal(_props: TransferListModalProps) {
  //   const { data } = useFetchAccount(accountNo)
  //   const content = data?.content ?? ({} as Account)

  return (
    <Modal>
      <Modal.Title>이체</Modal.Title>
      <Modal.Body>
        <TransferList />
      </Modal.Body>
    </Modal>
  );
}
