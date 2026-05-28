import { useFetchAccount } from '@/entities/account';
import type { Account } from '@/entities/account';
import { TransferList } from '@/features/transfer/ui/transfer-list';
import type { ModalConfig } from '@/shared/types';
import { Modal } from '@/shared/ui/modal/Modal';

interface TransferListModalProps extends ModalConfig {
  dummy?: any;
}

export function TransferListModal({ props }: TransferListModalProps) {
  //   const { data } = useFetchAccount(accountNo)
  //   const content = data?.content ?? ({} as Account)

  const { accountNo } = props;

  return (
    <Modal>
      <Modal.Title>이체</Modal.Title>
      <Modal.Body>
        <TransferList />
      </Modal.Body>
    </Modal>
  );
}

