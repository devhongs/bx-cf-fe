import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from 'lucide-react';
import type { CSSProperties, ComponentProps } from 'react';
import { Toaster as SonnerToaster } from 'sonner';

import { cn } from '../lib/cn';

import styles from './Toaster.module.css';

export type ToasterProps = ComponentProps<typeof SonnerToaster>;

// Sonner defines --normal-* on [data-sonner-toaster][data-sonner-theme='...'], which outranks a CSS
// module class. Setting them inline wins, and routing through var() keeps them resolving against
// whichever theme the host app applies: pc-web's `.dark` class, admin's [data-admin-theme], or
// mobile-web's light-only default. Each app reads the same tokens, so the wrapper stays app-agnostic.
const toasterStyle = {
  '--normal-bg': 'var(--surface-elevated)',
  '--normal-text': 'var(--foreground)',
  '--normal-border': 'var(--border)',
  '--border-radius': '8px',
} as CSSProperties;

// Only what Sonner's own defaults don't already give us; bg/border/radius/color come from --normal-*.
const toastStyle = {
  minHeight: '64px',
  padding: '14px 16px',
  boxShadow: 'var(--overlay-shadow)',
} as CSSProperties;

export function Toaster({
  className,
  closeButton = true,
  icons,
  position = 'bottom-center',
  style,
  toastOptions,
  ...props
}: ToasterProps) {
  const classNames = toastOptions?.classNames;

  return (
    <SonnerToaster
      {...props}
      className={cn(styles.toaster, className)}
      closeButton={closeButton}
      icons={{
        success: <CircleCheckIcon className={styles.successIcon} size={16} />,
        info: <InfoIcon className={styles.infoIcon} size={16} />,
        warning: <TriangleAlertIcon className={styles.warningIcon} size={16} />,
        error: <OctagonXIcon className={styles.errorIcon} size={16} />,
        loading: <Loader2Icon className={styles.loadingIcon} size={16} />,
        ...icons,
      }}
      position={position}
      style={{ ...toasterStyle, ...style }}
      toastOptions={{
        ...toastOptions,
        classNames: {
          ...classNames,
          toast: cn(styles.toast, classNames?.toast),
          content: cn(styles.content, classNames?.content),
          title: cn(styles.title, classNames?.title),
          description: cn(styles.description, classNames?.description),
          icon: cn(styles.icon, classNames?.icon),
          actionButton: cn(styles.actionButton, classNames?.actionButton),
          cancelButton: cn(styles.cancelButton, classNames?.cancelButton),
          closeButton: cn(styles.closeButton, classNames?.closeButton),
        },
        style: { ...toastStyle, ...toastOptions?.style },
      }}
    />
  );
}
