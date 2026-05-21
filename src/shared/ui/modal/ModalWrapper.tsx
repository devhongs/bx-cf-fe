import type { ModalConfig } from '@/shared/types';

import { cn } from '../../lib/utils';
import { useModalStore } from '../../model/modal/modal';

import { ModalContainer } from './ModalContainer';
import styles from './ModalWrapper.module.css';

export const ModalWrapper = ({ className }: { className?: string }) => {
  const { modals, close } = useModalStore();

  if (modals.length === 0) return null;

  return (
    <div className={cn(styles.root, className)}>
      {modals.map((config: ModalConfig, index) => (
        <ModalContainer
          {...config}
          key={config.id}
          index={index}
          onClose={close}
        />
      ))}
    </div>
  );
};
