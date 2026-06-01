import { cn } from '@/shared/lib/utils';
import { useModalStore } from '@/shared/model';
import type { ModalConfig } from '@/shared/types';

import { ModalContainer } from './ModalContainer';
import styles from './ModalProvider.module.css';

export const ModalProvider = ({ className }: { className?: string }) => {
  const { modals, close } = useModalStore();

  if (modals.length === 0) return null;

  return (
    <div className={cn(styles.root, className)}>
      {modals.map((config: ModalConfig, index) => (
        <ModalContainer {...config} key={config.id} index={index} onClose={close} />
      ))}
    </div>
  );
};
