import { X } from 'lucide-react';
import * as React from 'react';
import { Drawer as DrawerPrimitive } from 'vaul';

import { cn } from '../../lib/utils/cn';
import styles from './Drawer.module.css';

/* ── Root ── */
const Drawer = ({
  shouldScaleBackground = false,
  modal,
  open,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) => {
  React.useEffect(() => {
    if (!open || modal !== false || typeof document === 'undefined') return undefined;

    const enableOutsidePointerEvents = () => {
      document.body.style.pointerEvents = 'auto';
    };
    const frame = window.requestAnimationFrame(enableOutsidePointerEvents);
    enableOutsidePointerEvents();

    return () => {
      window.cancelAnimationFrame(frame);
      document.body.style.pointerEvents = 'auto';
    };
  }, [modal, open]);

  return (
    <DrawerPrimitive.Root
      shouldScaleBackground={shouldScaleBackground}
      modal={modal}
      open={open}
      {...props}
    />
  );
};
Drawer.displayName = 'Drawer';

const DrawerTrigger = DrawerPrimitive.Trigger;
const DrawerPortal = DrawerPrimitive.Portal;
const DrawerClose = DrawerPrimitive.Close;

/* ── Overlay ── */
const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay ref={ref} className={cn(styles.overlay, className)} {...props} />
));
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName;

/* ── Content ── */
export interface DrawerContentProps
  extends React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content> {
  /** 드래그 핸들 숨기기 */
  hideHandle?: boolean;
  /** X 버튼 숨기기 */
  hideClose?: boolean;
  /** Overlay 숨기기 */
  hideOverlay?: boolean;
  /** 풀스크린 (모바일 페이지 전환 스타일) */
  fullscreen?: boolean;
  /** 기본 위치/크기 스타일 없이 className만 적용 */
  unstyled?: boolean;
}

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  DrawerContentProps
>(
  (
    {
      className,
      children,
      hideHandle = false,
      hideClose = false,
      hideOverlay = false,
      fullscreen = false,
      unstyled = false,
      ...props
    },
    ref,
  ) => (
    <DrawerPortal>
      {!hideOverlay && <DrawerOverlay />}
      <DrawerPrimitive.Content
        ref={ref}
        className={cn(
          !unstyled && styles.content,
          !unstyled && (fullscreen ? styles.fullscreen : styles.sheet),
          className,
        )}
        {...props}
      >
        {/* 드래그 핸들 */}
        {!hideHandle && !fullscreen && <div className={styles.handle} />}
        {/* X 버튼 (풀스크린일 때만 기본 표시) */}
        {!hideClose && fullscreen && (
          <DrawerClose className={styles.close}>
            <X size={18} />
            <span className={styles.visuallyHidden}>닫기</span>
          </DrawerClose>
        )}
        {children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  ),
);
DrawerContent.displayName = 'DrawerContent';

/* ── 레이아웃 헬퍼 ── */
const DrawerHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn(styles.header, className)} {...props} />
);
DrawerHeader.displayName = 'DrawerHeader';

const DrawerFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn(styles.footer, className)} {...props} />
);
DrawerFooter.displayName = 'DrawerFooter';

const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title ref={ref} className={cn(styles.title, className)} {...props} />
));
DrawerTitle.displayName = DrawerPrimitive.Title.displayName;

const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description ref={ref} className={cn(styles.description, className)} {...props} />
));
DrawerDescription.displayName = DrawerPrimitive.Description.displayName;

export {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
};
