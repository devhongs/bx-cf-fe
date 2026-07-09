import { X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  CSSProperties,
  KeyboardEvent,
  ReactNode,
  PointerEvent as ReactPointerEvent,
} from 'react';

import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from '@bx/shared';

import styles from './AdminDrawer.module.css';

const DEFAULT_DRAWER_WIDTH = 560;
const MIN_DRAWER_WIDTH = 420;
const DRAWER_VIEWPORT_GAP = 56;
const RESIZE_STEP = 32;
const DRAWER_EXIT_ANIMATION_MS = 160;

function getMaxDrawerWidth() {
  if (typeof window === 'undefined') {
    return DEFAULT_DRAWER_WIDTH;
  }

  return Math.max(320, window.innerWidth - DRAWER_VIEWPORT_GAP);
}

function clampDrawerWidth(width: number) {
  const maxWidth = getMaxDrawerWidth();
  const minWidth = Math.min(MIN_DRAWER_WIDTH, maxWidth);

  return Math.min(Math.max(Math.round(width), minWidth), maxWidth);
}

function readStoredDrawerWidth(storageKey?: string) {
  if (!storageKey || typeof window === 'undefined') {
    return undefined;
  }

  try {
    const storedWidth = Number(window.localStorage.getItem(storageKey));
    return Number.isFinite(storedWidth) && storedWidth > 0 ? storedWidth : undefined;
  } catch {
    return undefined;
  }
}

function getInitialDrawerWidth(storageKey?: string) {
  return clampDrawerWidth(readStoredDrawerWidth(storageKey) ?? DEFAULT_DRAWER_WIDTH);
}

function persistDrawerWidth(storageKey: string | undefined, width: number) {
  if (!storageKey || typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(storageKey, String(width));
  } catch {
    // Storage can be unavailable in private or restricted browser contexts.
  }
}

interface AdminDrawerProps {
  open: boolean;
  title: string;
  subtitle?: string;
  storageKey?: string;
  footer?: ReactNode;
  children: ReactNode;
  onClose: () => void;
}

type AdminDrawerContent = Pick<AdminDrawerProps, 'children' | 'footer' | 'subtitle' | 'title'>;

export function AdminDrawer({
  open,
  title,
  subtitle,
  storageKey,
  footer,
  children,
  onClose,
}: AdminDrawerProps) {
  const [drawerWidth, setDrawerWidth] = useState(() => getInitialDrawerWidth(storageKey));
  const [shouldRender, setShouldRender] = useState(open);
  const [isClosing, setIsClosing] = useState(false);
  const resizeCleanupRef = useRef<(() => void) | null>(null);
  const exitTimerRef = useRef<number | null>(null);
  const lastOpenContentRef = useRef<AdminDrawerContent>({
    children,
    footer,
    subtitle,
    title,
  });

  if (open) {
    lastOpenContentRef.current = {
      children,
      footer,
      subtitle,
      title,
    };
  }

  const clearExitTimer = useCallback(() => {
    if (exitTimerRef.current === null) {
      return;
    }

    window.clearTimeout(exitTimerRef.current);
    exitTimerRef.current = null;
  }, []);

  useEffect(() => {
    setDrawerWidth(getInitialDrawerWidth(storageKey));
  }, [storageKey]);

  useEffect(() => {
    return () => {
      clearExitTimer();
      resizeCleanupRef.current?.();
    };
  }, [clearExitTimer]);

  useEffect(() => {
    if (open) {
      clearExitTimer();
      setShouldRender(true);
      setIsClosing(false);
      return;
    }

    if (!shouldRender) {
      return;
    }

    setIsClosing(true);
    clearExitTimer();
    exitTimerRef.current = window.setTimeout(() => {
      setShouldRender(false);
      setIsClosing(false);
      exitTimerRef.current = null;
    }, DRAWER_EXIT_ANIMATION_MS);
  }, [clearExitTimer, open, shouldRender]);

  const updateDrawerWidth = useCallback(
    (nextWidth: number) => {
      const clampedWidth = clampDrawerWidth(nextWidth);
      setDrawerWidth(clampedWidth);
      persistDrawerWidth(storageKey, clampedWidth);
    },
    [storageKey],
  );

  const handleResizePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();

      resizeCleanupRef.current?.();

      const startX = event.clientX;
      const startWidth = drawerWidth;

      const handlePointerMove = (moveEvent: PointerEvent) => {
        updateDrawerWidth(startWidth + startX - moveEvent.clientX);
      };

      const stopResize = () => {
        document.removeEventListener('pointermove', handlePointerMove);
        document.removeEventListener('pointerup', stopResize);
        resizeCleanupRef.current = null;
      };

      document.addEventListener('pointermove', handlePointerMove);
      document.addEventListener('pointerup', stopResize);
      resizeCleanupRef.current = stopResize;
    },
    [drawerWidth, updateDrawerWidth],
  );

  const handleResizeKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        updateDrawerWidth(drawerWidth + RESIZE_STEP);
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        updateDrawerWidth(drawerWidth - RESIZE_STEP);
      }

      if (event.key === 'Home') {
        event.preventDefault();
        updateDrawerWidth(MIN_DRAWER_WIDTH);
      }

      if (event.key === 'End') {
        event.preventDefault();
        updateDrawerWidth(getMaxDrawerWidth());
      }
    },
    [drawerWidth, updateDrawerWidth],
  );

  const isPresent = open || shouldRender;

  if (!isPresent) return null;

  const drawerStyle = {
    '--admin-drawer-width': `${drawerWidth}px`,
  } as CSSProperties;
  const maxDrawerWidth = getMaxDrawerWidth();
  const adminState = isClosing && !open ? 'closing' : 'open';
  const drawerContent = open
    ? {
        children,
        footer,
        subtitle,
        title,
      }
    : lastOpenContentRef.current;

  return (
    <Drawer
      open={isPresent}
      modal={false}
      dismissible={false}
      direction="right"
      noBodyStyles
      shouldScaleBackground={false}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
    >
      <div className={styles.scrim} data-admin-state={adminState} aria-hidden="true" />
      <DrawerContent
        unstyled
        hideOverlay
        hideHandle
        hideClose
        className={styles.drawer}
        data-admin-state={adminState}
        style={drawerStyle}
        onInteractOutside={(event) => {
          event.preventDefault();
        }}
        onEscapeKeyDown={(event) => {
          event.preventDefault();
          onClose();
        }}
      >
        <div
          aria-label="상세 패널 너비 조절"
          aria-orientation="vertical"
          aria-valuemax={maxDrawerWidth}
          aria-valuemin={Math.min(MIN_DRAWER_WIDTH, maxDrawerWidth)}
          aria-valuenow={drawerWidth}
          className={styles.resizeHandle}
          role="separator"
          tabIndex={0}
          title="드래그하여 너비 조절"
          onKeyDown={handleResizeKeyDown}
          onPointerDown={handleResizePointerDown}
        />
        <header className={styles.header}>
          <div>
            <DrawerTitle asChild>
              <h2>{drawerContent.title}</h2>
            </DrawerTitle>
            {drawerContent.subtitle && (
              <DrawerDescription asChild>
                <p>{drawerContent.subtitle}</p>
              </DrawerDescription>
            )}
          </div>
          <button type="button" onClick={onClose} title="닫기">
            <X size={16} />
          </button>
        </header>
        <div className={styles.body}>{drawerContent.children}</div>
        {drawerContent.footer && <footer className={styles.footer}>{drawerContent.footer}</footer>}
      </DrawerContent>
    </Drawer>
  );
}
