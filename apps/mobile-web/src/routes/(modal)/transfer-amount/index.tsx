import type { BankId, ModalConfig } from '@bx/shared';
import { Modal } from '@bx/shared';
import { TransferAmount } from '@/features/transfer/ui/transfer-amount';

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
      <Modal.Title>이체</Modal.Title>
      <Modal.Body>
        <TransferAmount bankId={bankId} accountNo={accountNo} name={name} />
      </Modal.Body>
    </Modal>
  );
}
