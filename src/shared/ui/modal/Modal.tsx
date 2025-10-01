import { useModal } from '@/shared/hooks'
import { ArrowLeft } from 'lucide-react'
import React, { type FC, type ReactNode } from 'react'
import { cn, getSlot } from '../../lib/utils'
import type { BaseProps } from '../../types'
import styles from './Modal.module.css'

export interface ModalProps<T = any> extends BaseProps {
  title?: string // openModal(ModalConfig) : ModalConfig.title 값
  description?: string // openModal(ModalConfig) : ModalConfig.description 값
  children?: React.ReactNode
}

const ModalComponent: React.FC<ModalProps> = ({
  title,
  children,
  className,
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
    <div className={cn(styles.start, className, 'nlp--modal-content')}>
      {/* header */}
      <div className={styles.header}>
        <div className={styles.left}>
          <button className={styles.btn_close} onClick={handleClose}>
            <ArrowLeft size={28} />
          </button>
        </div>
        <div className={styles.center}>{TitleSlot ?? title}</div>
        <div className={styles.right}></div>
      </div>
      {/* description */}
      {DescSlot && <div className={styles.description}>{DescSlot}</div>}
      {/* body */}
      <div className={cn(styles.body, 'modal-content')}>{BodySlot}</div>
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
 * @constructor
 */
export const ModalBody: FC<{ children: ReactNode }> = ({ children }) => {
  return <>{children}</>
}

/**
 * ModalFooter
 * @param children
 * @constructor
 */
export const ModalFooter: FC<{ children: ReactNode }> = ({ children }) => {
  return <>{children}</>
}
