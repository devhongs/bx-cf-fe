import { UserAvatar } from '@/entities/user/ui/user-avatar/UserAvatar';
import type { ModalConfig } from '@/shared/types';
import { Modal } from '@/shared/ui/modal/Modal';

import styles from './index.module.css';

interface UserInfoModalProps extends ModalConfig {
  dummy?: any;
}

export function UserInfoModal({ props }: UserInfoModalProps) {
  return (
    <Modal closeButtonType="close">
      <Modal.Title>내 정보</Modal.Title>
      <Modal.Body>
        <UserAvatar
          className={styles.userAvatar}
          name="사용자 이름"
          imageUrl="/assets/images/avatar/avatar-men.svg"
          size={75}
          showName={true}
        />
        <div className={styles.dividerContainer}>
          <span className={styles.divider}></span>
        </div>
        <div>
          <h3 className={styles.title}>기본정보</h3>
          <h5 className={styles.description}>상세 내용...</h5>
        </div>
        <div className={styles.dividerContainer}>
          <span className={styles.divider}></span>
        </div>
        <div>
          <h3 className={styles.title}>집정보</h3>
          <h5 className={styles.description}>상세 내용...</h5>
        </div>
        <div className={styles.dividerContainer}>
          <span className={styles.divider}></span>
        </div>
        <div>
          <h3 className={styles.title}>직장정보</h3>
          <h5 className={styles.description}>상세 내용...</h5>
        </div>
        <div className={styles.dividerContainer}></div>
        <button className={styles.editButton}>수정하기</button>
      </Modal.Body>
    </Modal>
  );
}

