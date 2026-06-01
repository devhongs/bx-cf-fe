import { ArrowLeft, X } from 'lucide-react';
import type React from 'react';
import type { FC, ReactNode } from 'react';

import { useModal } from '@/shared/hooks';

import { cn, getSlot } from '../../lib/utils';
import type { BaseProps } from '../../types';
import { IconButton } from '../icon-button/IconButton';

import styles from './Modal.module.css';

export interface ModalProps extends BaseProps {
  /**
   * openModal(ModalConfig) : ModalConfig.title 값
   */
  title?: string;
  /**
   * openModal(ModalConfig) : ModalConfig.description 값
   */
  description?: string;
  /**
   * Modal 내부에 표시할 React 노드들
   */
  children?: React.ReactNode;
  /**
   * 닫기 버튼 타입 ('close' | 'back')
   */
  closeButtonType?: 'close' | 'back';
}

const Title: FC<{ children: ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

const Description: FC<{ children: ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

const Body: FC<{ children: ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return <div className={cn(styles.body, className)}>{children}</div>;
};

const Footer: FC<{ children: ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

const ModalComponent: React.FC<ModalProps> = ({
  title,
  children,
  className,
  closeButtonType = 'back',
}) => {
  const { close: closeModal } = useModal();

  const TitleSlot = getSlot(children, Title);
  const DescSlot = getSlot(children, Description);
  const BodySlot = getSlot(children, Body);
  const FooterSlot = getSlot(children, Footer);

  const handleClose = () => {
    closeModal();
  };

  return (
    <div className={cn(styles.layout, className, 'bx-modal')}>
      {/* header */}
      <div className={styles.header}>
        <div className={styles.left}>
          <IconButton
            className={styles.btn_close}
            icon={closeButtonType === 'back' ? ArrowLeft : X}
            onClick={handleClose}
          />
        </div>
        <div className={styles.center}>{TitleSlot ?? title}</div>
        <div className={styles.right}></div>
      </div>
      {/* description */}
      {DescSlot && <div className={styles.description}>{DescSlot}</div>}
      {/* body */}
      <div className={cn(styles.body, 'modal-body')}>{BodySlot}</div>
      {/* footer */}
      {FooterSlot && <div className={styles.footer}>{FooterSlot}</div>}
    </div>
  );
};

export const Modal = Object.assign(ModalComponent, {
  Title,
  Description,
  Body,
  Footer,
});

