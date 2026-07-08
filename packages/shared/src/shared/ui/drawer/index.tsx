import { X } from 'lucide-react';
import * as React from 'react';
import { Drawer as DrawerPrimitive } from 'vaul';

import { cn } from '../lib/cn';

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
  <DrawerPrimitive.Overlay
    ref={ref}
    className={cn('fixed inset-0 z-50 bg-black/50', className)}
    {...props}
  />
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
          !unstyled && 'fixed inset-x-0 bottom-0 z-50 flex flex-col bg-surface-elevated',
          !unstyled && (fullscreen ? 'h-[100dvh] rounded-none' : 'max-h-[90dvh] rounded-t-2xl'),
          className,
        )}
        {...props}
      >
        {/* 드래그 핸들 */}
        {!hideHandle && !fullscreen && (
          <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-border" />
        )}
        {/* X 버튼 (풀스크린일 때만 기본 표시) */}
        {!hideClose && fullscreen && (
          <DrawerClose
            className={cn(
              'absolute right-4 top-4 rounded-md p-1',
              'opacity-60 hover:opacity-100 transition-opacity focus:outline-none',
            )}
          >
            <X size={18} />
            <span className="sr-only">닫기</span>
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
  <div className={cn('flex flex-col gap-1 p-4', className)} {...props} />
);
DrawerHeader.displayName = 'DrawerHeader';

const DrawerFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col gap-2 p-4', className)} {...props} />
);
DrawerFooter.displayName = 'DrawerFooter';

const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn('text-lg font-semibold leading-none tracking-tight', className)}
    {...props}
  />
));
DrawerTitle.displayName = DrawerPrimitive.Title.displayName;

const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted', className)}
    {...props}
  />
));
DrawerDescription.displayName = DrawerPrimitive.Description.displayName;

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
