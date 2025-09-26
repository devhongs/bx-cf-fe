import { useCallback } from 'react'

import { useModalStore } from './modal'

function useSetModal() {
  const pushModal = useModalStore((state) => state.pushModalList)
  const popModal = useModalStore((state) => state.popModalList)
  const resetModal = useModalStore((state) => state.resetModal)

  // / ///////////////////////////////////////////////////////////////////////
  // modal
  // / ///////////////////////////////////////////////////////////////////////

  /**
   * pushModalList
   */
  const pushModalList = useCallback(
    (payload: any) => {
      // console.log("useStore pushModalList :: ", modal.modalList, payload)
      pushModal(payload)
    },
    [pushModal],
  )

  /**
   * popModalList
   */
  const popModalList = useCallback(
    (payload: any) => {
      // console.log("useStore popModalList :: ", payload)
      popModal(payload)
    },
    [popModal],
  )

  return {
    pushModalList,
    popModalList,
    resetModal,
  }
}

export default useSetModal
