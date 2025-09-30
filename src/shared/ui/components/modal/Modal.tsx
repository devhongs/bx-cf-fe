import React, { type FC, type ReactNode, useRef } from 'react'
import { cn, getSlot } from '../../../lib/utils'
import type { ModalConfig } from '../../../types'
import styles from './modal.module.css'

export interface ModalProps<T = any> extends ModalConfig {
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
  const TitleSlot = getSlot(children, ModalTitle)
  const DescSlot = getSlot(children, ModalDescription)
  const BodySlot = getSlot(children, ModalBody)
  const FooterSlot = getSlot(children, ModalFooter)

  const contentRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLDivElement>(null)

  return (
    <div className={cn(styles.start, className, 'nlp--modal-content')}>
      {/* title */}
      <div ref={titleRef} className={styles.title}>
        {TitleSlot}
      </div>
      {/* description */}
      {DescSlot && <div className={styles.description}>{DescSlot}</div>}
      {/* body */}
      <div ref={contentRef} className={cn(styles.contents, 'modal-content')}>
        {BodySlot}
      </div>
      {/* footer */}
      {FooterSlot && (
        <div ref={footerRef} className={styles.footer}>
          {FooterSlot}
        </div>
      )}
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
