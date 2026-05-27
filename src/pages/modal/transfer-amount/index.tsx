import type { BankId } from '@/entities/account';
import { TransferAmount } from '@/features/transfer/ui/transfer-amount';
import type { ModalConfig } from '@/shared/types';
import { Modal, ModalBody, ModalTitle } from '@/shared/ui/modal/Modal';

type TransferAmountProps = {
  bankId: BankId;
  accountNo: string;
  name: string;
};

interface TransferAmountModalProps extends ModalConfig {
  props?: TransferAmountProps;
  dummy?: any;
}

export function TransferAmountModal({ props }: TransferAmountModalProps) {
  const { bankId, accountNo, name } = props || {
    bankId: undefined,
    accountNo: '',
    name: '',
  };
  return (
    <Modal>
      <ModalTitle>이체</ModalTitle>
      <ModalBody>
        <TransferAmount bankId={bankId} accountNo={accountNo} name={name} />
      </ModalBody>
    </Modal>
  );
}
