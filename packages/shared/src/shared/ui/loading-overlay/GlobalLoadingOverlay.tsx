import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { cn } from '../../lib/utils/cn';
import { useGlobalLoadingStore } from '../../model/loading/loading.store';
import { Spinner } from '../spinner/Spinner';

import styles from './GlobalLoadingOverlay.module.css';

const DEFAULT_DELAY_MS = 150;

export interface GlobalLoadingOverlayProps {
  delay?: number;
}

export function GlobalLoadingOverlay({ delay = DEFAULT_DELAY_MS }: GlobalLoadingOverlayProps) {
  const isLoading = useGlobalLoadingStore((state) => state.pendingCount > 0);
  const overlayContainer = useGlobalLoadingStore((state) => state.overlayContainer);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setVisible(false);
      return;
    }

    const timer = window.setTimeout(() => setVisible(true), delay);
    return () => window.clearTimeout(timer);
  }, [delay, isLoading]);

  if (!visible) return null;

  const position = overlayContainer ? 'container' : 'viewport';
  const overlay = (
    <div
      role="status"
      aria-busy="true"
      aria-label="요청 처리 중"
      aria-live="polite"
      className={cn(
        styles.overlay,
        position === 'container' ? styles.containerOverlay : styles.viewportOverlay,
      )}
      data-position={position}
      data-slot="global-loading-overlay"
    >
      <Spinner aria-hidden="true" className={styles.spinner} />
    </div>
  );

  return overlayContainer ? createPortal(overlay, overlayContainer) : overlay;
}
