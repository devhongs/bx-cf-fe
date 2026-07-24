import { create } from 'zustand';

interface GlobalLoadingStore {
  overlayContainer: HTMLElement | null;
  pendingCount: number;
  registerOverlayContainer: (container: HTMLElement) => void;
  unregisterOverlayContainer: (container: HTMLElement) => void;
  start: () => void;
  finish: () => void;
}

export const useGlobalLoadingStore = create<GlobalLoadingStore>((set) => ({
  overlayContainer: null,
  pendingCount: 0,
  registerOverlayContainer: (container) => set({ overlayContainer: container }),
  unregisterOverlayContainer: (container) =>
    set((state) => ({
      overlayContainer: state.overlayContainer === container ? null : state.overlayContainer,
    })),
  start: () => set((state) => ({ pendingCount: state.pendingCount + 1 })),
  finish: () =>
    set((state) => ({
      pendingCount: Math.max(0, state.pendingCount - 1),
    })),
}));

export const withGlobalLoading = async <T>(operation: () => Promise<T>): Promise<T> => {
  const { start, finish } = useGlobalLoadingStore.getState();
  start();

  try {
    return await operation();
  } finally {
    finish();
  }
};
