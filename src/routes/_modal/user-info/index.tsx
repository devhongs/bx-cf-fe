import type {ModalConfig} from '@/shared/types';
import { Modal, ModalBody, ModalTitle } from '@/shared/ui/modal/Modal'

interface UserInfoModalProps extends ModalConfig {
  dummy?: any
}

export default function UserInfoModal({ props }: UserInfoModalProps) {
  return (
    <Modal closeButtonType="close">
      <ModalTitle>내 정보</ModalTitle>
      <ModalBody>
        <div>사용자 사진</div>
        <div>기본정보</div>
        <div>집정보</div>
        <div>직장정보</div>
        <div>수정하기 버튼</div>
      </ModalBody>
    </Modal>
  )
}
