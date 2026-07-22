import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from 'lucide-react';
import type { ComponentProps } from 'react';
import { Toaster as SonnerToaster } from 'sonner';

import { cn } from '../lib/cn';

import styles from './Toaster.module.css';

export type ToasterProps = ComponentProps<typeof SonnerToaster>;

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
      style={style}
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
        style: toastOptions?.style,
      }}
    />
  );
}
