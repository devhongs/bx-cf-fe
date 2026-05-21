import { Modal, ModalBody, ModalTitle } from '@/shared/ui/modal/Modal';

interface AccountDetailProps {
  accoutNo?: number;
}

export default function AccountDetail(_props: AccountDetailProps) {
  return (
    <Modal>
      <ModalTitle>계정 상세</ModalTitle>
      <ModalBody>계좌상세...</ModalBody>
    </Modal>
  );
}
