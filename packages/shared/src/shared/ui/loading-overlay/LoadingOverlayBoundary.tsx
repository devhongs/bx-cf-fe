import { type HTMLAttributes, useLayoutEffect, useRef } from 'react';

import { cn } from '../../lib/utils/cn';
import { useGlobalLoadingStore } from '../../model/loading/loading.store';

import styles from './GlobalLoadingOverlay.module.css';

export type LoadingOverlayBoundaryProps = HTMLAttributes<HTMLDivElement>;

export function LoadingOverlayBoundary({
  children,
  className,
  ...props
}: LoadingOverlayBoundaryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const register = useGlobalLoadingStore((state) => state.registerOverlayContainer);
  const unregister = useGlobalLoadingStore((state) => state.unregisterOverlayContainer);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    register(container);
    return () => unregister(container);
  }, [register, unregister]);

  return (
    <div {...props} className={cn(styles.boundary, className)} data-slot="loading-overlay-boundary">
      {children}
      <div
        ref={containerRef}
        className={styles.portalTarget}
        data-slot="loading-overlay-portal-target"
      />
    </div>
  );
}
