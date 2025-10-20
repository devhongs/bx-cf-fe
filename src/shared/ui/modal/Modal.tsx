import { ArrowLeft, X } from 'lucide-react'
import React from 'react'
import type { FC, ReactNode } from 'react'

import { useModal } from '@/shared/hooks'

import { cn, getSlot } from '../../lib/utils'
import type { BaseProps } from '../../types'
import { IconButton } from '../icon-button/IconButton'

import styles from './Modal.module.css'

export interface ModalProps<T = any> extends BaseProps {
  /**
   * openModal(ModalConfig) : ModalConfig.title 값
   */
  title?: string
  /**
   * openModal(ModalConfig) : ModalConfig.description 값
   */
  description?: string
  /**
   * Modal 내부에 표시할 React 노드들
   */
  children?: React.ReactNode
  /**
   * 닫기 버튼 타입 ('close' | 'back')
   */
  closeButtonType?: 'close' | 'back'
}

const ModalComponent: React.FC<ModalProps> = ({
  title,
  children,
  className,
  closeButtonType = 'back',
  ...props
}) => {
  const { close: closeModal } = useModal()

  const TitleSlot = getSlot(children, ModalTitle)
  const DescSlot = getSlot(children, ModalDescription)
  const BodySlot = getSlot(children, ModalBody)
  const FooterSlot = getSlot(children, ModalFooter)

  const handleClose = () => {
    closeModal()
  }

  return (
    <div className={cn(styles.start, className, 'bx-modal')}>
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
  )
}

export const Modal = ModalComponent

/**
 * ModalTitle
 * @param children
 * @constructor
 */
export const ModalTitle: FC<{ children: ReactNode }> = ({ children }) => {
  return <>{children}</>
}

/**
 * ModalDescription
 * @param children
 * @constructor
 */
export const ModalDescription: FC<{ children: ReactNode }> = ({ children }) => {
  return <>{children}</>
}

/**
 * ModalBody
 * @param children
 * @param className
 * @constructor
 */
export const ModalBody: FC<{ children: ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return <div className={cn(styles.body, className)}>{children}</div>
}

/**
 * ModalFooter
 * @param children
 * @constructor
 */
export const ModalFooter: FC<{ children: ReactNode }> = ({ children }) => {
  return <>{children}</>
}
