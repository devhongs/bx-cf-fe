import { useFetchAccount } from '@/entities/account';
import type { Account } from '@/entities/account';
import TransferList from '@/features/transfer/ui/transfer-list';
import type { ModalConfig } from '@/shared/types';
import { Modal, ModalBody, ModalTitle } from '@/shared/ui/modal/Modal';

interface TransferListModalProps extends ModalConfig {
  dummy?: any;
}

export default function TransferListModal({ props }: TransferListModalProps) {
  //   const { data } = useFetchAccount(accountNo)
  //   const content = data?.content ?? ({} as Account)

  const { accountNo: accountNo } = props;

  return (
    <Modal>
      <ModalTitle>이체</ModalTitle>
      <ModalBody>
        <TransferList />
      </ModalBody>
    </Modal>
  );
}
