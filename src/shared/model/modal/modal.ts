import { create } from 'zustand'

// modal

// screenId, instance, params
export interface PopupState {
  screenId: string
  modalUUID: string
  instance: any
  params: any
  resolve: any
}

// screenId, instance, params
export interface ModalState {
  modalList: Array<PopupState>
  closeParam: any
}

interface ModalStore extends ModalState {
  setModalList: (modalList: Array<PopupState>) => void
  setCloseParam: (closeParam: any) => void
  pushModalList: (popup: PopupState) => void
  popModalList: (closeParam?: any) => void
  resetModal: () => void
}

const initialModalState: ModalState = {
  modalList: [],
  closeParam: null,
}

export const useModalStore = create<ModalStore>((set, get) => ({
  ...initialModalState,

  setModalList: (modalList: Array<PopupState>) => set({ modalList }),

  setCloseParam: (closeParam: any) => set({ closeParam }),

  pushModalList: (popup: PopupState) =>
    set((state) => ({
      modalList: [...state.modalList, popup],
    })),

  popModalList: (closeParam?: any) =>
    set((state) => ({
      modalList: state.modalList.slice(0, state.modalList.length - 1),
      closeParam,
    })),

  resetModal: () => set(initialModalState),
}))
