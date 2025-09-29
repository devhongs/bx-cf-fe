import { useEffect, useRef, useState } from 'react'

import useModal from '@/shared/hooks/useModal'
import useGetModal from '@/shared/model/modal/useGetModal'

function Modal({ className = '', children }: any) {
  const $modalHooks = useModal()

  const { modal } = useGetModal()

  const modalList = modal.modalList
  const modalInfo = modalList[modalList.length - 1] || {}

  // useDetectBackButton(() => {
  //   if (modalList?.length > 0) {
  //     const currentUUID = window.location.search.split('modalUUID=')[1]
  //     const currentModalIndex = modalList.findIndex(
  //       (modalItem: any) => modalItem.modalUUID === currentUUID,
  //     )
  //     const closeModalInfo = modalList[currentModalIndex + 1]

  //     if (closeModalInfo) {
  //       $modalHooks.closePopup(closeModalInfo, null, true)
  //     }
  //   }
  // })

  if (modalList.length > 0) {
    const currentUUID = window.location.search.split('modalUUID=')[1]
    const currentModalIndex = modalList.findIndex(
      (modalItem: any) => modalItem.modalUUID === currentUUID,
    )
    const closeModalInfo = modalList[currentModalIndex + 1]

    $modalHooks.closePopup(closeModalInfo, null, true)
  }

  const initModalRef = useRef<any>(null)
  const [render, setRender] = useState<boolean>(false)

  useEffect(() => {
    initModalRef.current = modalInfo
    setRender(true)
  }, [modalInfo])

  if (!render) {
    return null
  }

  return (
    <div
      id={initModalRef.current.modalUUID}
      className={`modal modal-wrap ${className}`}
      style={{ display: 'block' }}
    >
      {children}
    </div>
  )
}
export default Modal
