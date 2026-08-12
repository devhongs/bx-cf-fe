import { ArrowLeft, X } from 'lucide-react';
/**
 * Modal — 레이아웃 셸 컴포넌트
 *
 * Dialog / Drawer 내부에서 사용하는 컨텐츠 레이아웃.
 * 오버레이·포탈·애니메이션은 ModalContainer(각 앱)가 담당.
 *
 * 사용 예:
 *   <Modal>
 *     <Modal.Title>제목</Modal.Title>
 *     <Modal.Body>내용</Modal.Body>
 *     <Modal.Footer><Button>확인</Button></Modal.Footer>
 *   </Modal>
 */
import type { FC, ReactNode } from 'react';
import type * as React from 'react';

import { useModal } from '../../hooks';
import { cn } from '../../lib/utils/cn';
import { getSlot } from '../../lib/utils/component-util';
import type { BaseProps } from '../../types';
import { IconButton } from '../icon-button/IconButton';
import styles from './Modal.module.css';

export interface ModalProps extends BaseProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  closeButtonType?: 'close' | 'back';
}

/* ── 슬롯 컴포넌트 ── */
const Title: FC<{ children: ReactNode }> = ({ children }) => <>{children}</>;
const Description: FC<{ children: ReactNode }> = ({ children }) => <>{children}</>;
const Body: FC<{ children: ReactNode; className?: string }> = ({ children, className }) => (
  <div className={cn(styles.body, className)}>{children}</div>
);
const Footer: FC<{ children: ReactNode; className?: string }> = ({ children, className }) => (
  <div className={cn(styles.footer, className)}>{children}</div>
);

/* ── 메인 컴포넌트 ── */
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

  return (
    <div className={cn(styles.root, className)}>
      {/* 헤더 */}
      <div className={styles.header}>
        <div className={styles.headerAction}>
          <IconButton
            icon={closeButtonType === 'back' ? ArrowLeft : X}
            onClick={() => closeModal()}
          />
        </div>
        <div className={styles.title}>{TitleSlot ?? title}</div>
        <div className={styles.headerSpacer} />
      </div>

      {/* 설명 */}
      {DescSlot && <div className={styles.description}>{DescSlot}</div>}

      {/* 바디 */}
      <div className={styles.content}>{BodySlot}</div>

      {/* 풋터 */}
      {FooterSlot && FooterSlot}
    </div>
  );
};

export const Modal = Object.assign(ModalComponent, {
  Title,
  Description,
  Body,
  Footer,
});
