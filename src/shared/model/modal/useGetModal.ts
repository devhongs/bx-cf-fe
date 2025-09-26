import { useShallow } from 'zustand/react/shallow'

import { useModalStore } from './modal'

function useGetModal() {
  const modal = useModalStore(
    useShallow((s) => ({
      modalList: s.modalList,
      closeParam: s.closeParam,
    })),
  )

  return { modal }
}

export default useGetModal
