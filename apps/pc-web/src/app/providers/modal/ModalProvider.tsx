import type { ModalConfig } from '@bx/shared';
import { useModalStore } from '@bx/shared';

import { ModalContainer } from './ModalContainer';

export function ModalProvider() {
  const { modals } = useModalStore();

  if (modals.length === 0) return null;

  return (
    <>
      {modals.map((config: ModalConfig, index: number) => (
        <ModalContainer key={config.id} {...config} index={index} />
      ))}
    </>
  );
}
