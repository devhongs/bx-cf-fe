import { v4 } from 'uuid';

import { useModalStore } from '../model';
import type { ModalConfig, useModalReturnValue } from '../types';

const useModal = (): useModalReturnValue => {
  const { modals, open: openModal, close: closeModal, closeAll: closeAllModal } = useModalStore();

  /**
   * 일반 모달을 엽니다.
   *
   * @param config - 모달 설정 객체 (ModalConfig) 또는 설정을 반환하는 함수
   * @returns Promise<any> - 모달 닫힘 시 전달된 데이터로 resolve됩니다.
   *
   * 기본적으로 모바일 환경에선 전체 너비(m_full), 그 외엔 'md' 너비를 사용합니다.
   * config.onClose가 있다면 해당 콜백도 함께 호출됩니다.
   */
  const open = (config: ModalConfig | (() => ModalConfig)): Promise<any> => {
    return new Promise((resolve, reject) => {
      // 함수형 config인 경우 호출하여 실제 config 값을 가져옴
      const resolvedConfig = typeof config === 'function' ? config() : config;

      // 중복 오픈 방지 (최상단 모달과 동일한 경로인 경우 차단하여 더블 클릭 등 방지)
      const activeModal = useModalStore.getState().modals.at(-1);
      if (activeModal && activeModal.path === resolvedConfig.path) {
        console.warn(`[useModal] Duplicate modal open prevented for path: ${resolvedConfig.path}`);
        reject(new Error(`Duplicate modal open prevented for path: ${resolvedConfig.path}`));
        return;
      }

      const newConfig: ModalConfig = {
        ...resolvedConfig,
        id: v4(),
        onClose: (data?: any) => {
          resolvedConfig.onClose?.(data);
          resolve(data);
        },
      };
      openModal(newConfig);
    });
  };

  /**
   * 현재 활성화된 모달을 닫습니다.
   *
   * @param data - 모달 종료 시 전달할 데이터 (optional)
   */
  const close = (data?: any) => closeModal(data);

  /**
   * 현재 열린 모든 모달을 닫습니다.
   */
  const closeAll = () => closeAllModal();

  return {
    open,
    close,
    closeAll,
    modals,
  };
};

export { useModal };
