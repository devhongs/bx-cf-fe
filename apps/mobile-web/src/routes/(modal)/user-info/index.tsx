import { useUserName, UserAvatar } from '@bx/shared';
import type { ModalConfig } from '@bx/shared';
import { Modal } from '@bx/shared';

import styles from './index.module.css';

interface UserInfoModalProps extends ModalConfig {
  dummy?: any;
}

export function UserInfoModal(_props: UserInfoModalProps) {
  const userName = useUserName();

  return (
    <Modal closeButtonType="close">
      <Modal.Title>내 정보</Modal.Title>
      <Modal.Body>
        <UserAvatar
          className={styles.userAvatar}
          name={userName}
          imageUrl="/assets/images/avatar/avatar-men.svg"
          size={75}
          showName={true}
        />
        <div className={styles.dividerContainer}>
          <span className={styles.divider} />
        </div>
        <div>
          <h3 className={styles.title}>기본정보</h3>
          <h5 className={styles.description}>상세 내용...</h5>
        </div>
        <div className={styles.dividerContainer}>
          <span className={styles.divider} />
        </div>
        <div>
          <h3 className={styles.title}>집정보</h3>
          <h5 className={styles.description}>상세 내용...</h5>
        </div>
        <div className={styles.dividerContainer}>
          <span className={styles.divider} />
        </div>
        <div>
          <h3 className={styles.title}>직장정보</h3>
          <h5 className={styles.description}>상세 내용...</h5>
        </div>
        <div className={styles.dividerContainer} />
        <button className={styles.editButton}>수정하기</button>
      </Modal.Body>
    </Modal>
  );
}

