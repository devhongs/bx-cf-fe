import { useEffect } from 'react'
import { cn } from '../../../lib/utils'
import { useModalStore } from '../../../model/modal/modal'
import styles from './modal-wrapper.module.css'

const ModalWrapperComponent = ({ className }: { className?: string }) => {
  const { modals, close } = useModalStore()

  const handleClose = (modalData?: any) => {
    close(modalData)
  }

  useEffect(() => {
    console.log(modals)
  }, [modals])

  return (
    <div className={cn(styles.root, className)}>
      <div className={styles.dim}>XXXX</div>
      {/* {modals?.map((config: ModalConfig) => (
        <div key={config.id}>{config.content}</div>
        // <Modal {...config} key={config.id} onClose={handleClose} />
      ))} */}
    </div>
  )
}
export const ModalWrapper = ModalWrapperComponent
