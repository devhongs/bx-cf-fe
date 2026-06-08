import { Modal } from '@bx/shared';

interface AccountDetailProps {
  accoutNo?: number;
}

export function AccountDetail(_props: AccountDetailProps) {
  return (
    <Modal>
      <Modal.Title>계정 상세</Modal.Title>
      <Modal.Body>계좌상세...</Modal.Body>
    </Modal>
  );
}

