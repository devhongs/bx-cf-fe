import { v4 } from 'uuid';
import { create } from 'zustand';

export interface AlertConfig {
  title?: string;
  message: string;
  confirmText?: string;
  /** 지정하면 취소 버튼이 있는 confirm으로 뜬다. 없으면 확인만 있는 알럿. */
  cancelText?: string;
}

interface AlertEntry extends AlertConfig {
  id: string;
  resolve: (confirmed: boolean) => void;
}

interface AlertStore {
  /** 대기열. 화면에는 항상 queue[0]만 뜬다. */
  queue: AlertEntry[];
  /** 알럿을 띄우고, 사용자가 닫으면 resolve되는 Promise를 반환한다. */
  open: (config: AlertConfig) => Promise<boolean>;
  /**
   * 현재 알럿을 닫고 다음 대기 알럿을 표시한다.
   * confirm 버튼으로 닫을 때만 true. ESC·오버레이 클릭은 취소로 본다.
   */
  close: (confirmed?: boolean) => void;
}

/**
 * Promise 기반 공통 알럿.
 *
 * useModal(라우트 path 기반)과 달리 React 트리 밖(중앙 에러 핸들러 등)에서도 호출할 수 있고,
 * "닫힘"을 await 할 수 있어야 해서 별도 스토어로 둔다.
 */
export const useAlertStore = create<AlertStore>((set, get) => ({
  queue: [],
  open: (config: AlertConfig) =>
    new Promise<boolean>((resolve) => {
      set((state) => ({ queue: [...state.queue, { ...config, id: v4(), resolve }] }));
    }),
  close: (confirmed = false) => {
    const [current, ...rest] = get().queue;
    if (!current) return;

    set({ queue: rest });
    current.resolve(confirmed);
  },
}));

/** React 밖에서 알럿을 띄울 때 사용한다. 닫히면 resolve된다. */
export const openAlert = async (config: Omit<AlertConfig, 'cancelText'>): Promise<void> => {
  await useAlertStore.getState().open(config);
};

/**
 * React 밖에서 확인/취소를 물을 때 사용한다.
 * 확인이면 true, 취소·ESC·오버레이 클릭이면 false로 resolve된다.
 */
export const openConfirm = (config: AlertConfig): Promise<boolean> =>
  useAlertStore.getState().open({ cancelText: '취소', ...config });
