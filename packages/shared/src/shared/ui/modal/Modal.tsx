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
import type { BaseProps } from '../../types';
import { IconButton } from '../icon-button/IconButton';
import { cn } from '../lib/cn';
import { getSlot } from '../lib/component-util';

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
  <div className={cn('flex-1 overflow-y-auto p-4', className)}>{children}</div>
);
const Footer: FC<{ children: ReactNode; className?: string }> = ({ children, className }) => (
  <div className={cn('border-t border-gray-100 p-4', className)}>{children}</div>
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
    <div className={cn('flex h-full w-full flex-col', className)}>
      {/* 헤더 */}
      <div className="flex h-14 shrink-0 items-center border-b border-gray-100 px-2">
        <div className="flex w-10 items-center justify-start">
          <IconButton
            icon={closeButtonType === 'back' ? ArrowLeft : X}
            onClick={() => closeModal()}
          />
        </div>
        <div className="flex flex-1 items-center justify-center text-base font-semibold">
          {TitleSlot ?? title}
        </div>
        <div className="w-10" />
      </div>

      {/* 설명 */}
      {DescSlot && <div className="shrink-0 px-4 py-2 text-sm text-gray-500">{DescSlot}</div>}

      {/* 바디 */}
      <div className="flex-1 overflow-y-auto">{BodySlot}</div>

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
