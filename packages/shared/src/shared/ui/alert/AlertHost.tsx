import { useAlertStore } from '../../model/alert/alert.store';
import { DialogPrimitive } from '../dialog';

import styles from './AlertHost.module.css';

/**
 * 공통 알럿 렌더러. 앱 root에 한 번만 마운트한다. (Toaster와 동일한 위치)
 * 내용은 useAlertStore가 들고 있고, 중앙 에러 핸들러(handleApiError)가 openAlert()로 채운다.
 */
export function AlertHost() {
  const current = useAlertStore((state) => state.queue[0]);
  const close = useAlertStore((state) => state.close);

  return (
    <DialogPrimitive.Root
      open={!!current}
      onOpenChange={(open) => {
        if (!open) close();
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className={styles.overlay} />
        <DialogPrimitive.Content className={styles.content}>
          <DialogPrimitive.Title className={styles.title}>
            {current?.title ?? '알림'}
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className={styles.message}>
            {current?.message}
          </DialogPrimitive.Description>
          <div className={styles.footer}>
            {current?.cancelText && (
              <button className={styles.cancel} onClick={() => close(false)} type="button">
                {current.cancelText}
              </button>
            )}
            <button className={styles.confirm} onClick={() => close(true)} type="button">
              {current?.confirmText ?? '확인'}
            </button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
