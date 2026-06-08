import { cn } from '@bx/shared';
import { useModalStore } from '@bx/shared';
import type { ModalConfig } from '@bx/shared';

import { ModalContainer } from './ModalContainer';
import styles from './ModalProvider.module.css';

export const ModalProvider = ({ className }: { className?: string }) => {
  const { modals, close } = useModalStore();

  if (modals.length === 0) return null;

  return (
    <div className={cn(styles.root, className)}>
      {modals.map((config: ModalConfig, index: number) => (
        <ModalContainer {...config} key={config.id} index={index} onClose={close} />
      ))}
    </div>
  );
};
