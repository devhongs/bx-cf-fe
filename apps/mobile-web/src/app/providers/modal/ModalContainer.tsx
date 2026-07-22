import { Suspense, lazy } from 'react';
import type { ComponentType, CSSProperties } from 'react';

import type { ModalConfig } from '@bx/shared';
import { DialogPrimitive, useModalStore } from '@bx/shared';

import styles from './ModalContainer.module.css';

/* ── 모달 컴포넌트 레지스트리 ── */
const modalModules = import.meta.glob<Record<string, ComponentType<any>>>(
  '/src/routes/\\(modal\\)/**/index.tsx',
  { eager: false },
);

const modalPathMap = Object.keys(modalModules).reduce(
  (acc, path) => {
    const match = path.match(/\/src\/routes\/\(modal\)\/(.+)\/index\.tsx$/);
    if (match) acc[match[1]] = path;
    return acc;
  },
  {} as Record<string, string>,
);

const lazyModalComponents = Object.keys(modalModules).reduce(
  (acc, path) => {
    const importFn = modalModules[path];
    acc[path] = lazy(() =>
      importFn().then((mod) => {
        const key = Object.keys(mod).find((k) => typeof mod[k] === 'function');
        return { default: key ? mod[key] : mod.default };
      }),
    );
    return acc;
  },
  {} as Record<string, ReturnType<typeof lazy> | undefined>,
);

/* ── ModalContainer ── */
interface ModalContainerProps extends ModalConfig {
  index?: number;
}

export const ModalContainer = ({ index = 0, ...config }: ModalContainerProps) => {
  const { close } = useModalStore();

  const fullPath = config.path?.startsWith('/') ? config.path : modalPathMap[config.path ?? ''];

  if (!fullPath) {
    if (config.path) console.error(`[mobile-web] Modal not found: ${config.path}`);
    return null;
  }

  const Component = lazyModalComponents[fullPath];
  if (!Component) return null;

  const handleOpenChange = (open: boolean) => {
    if (!open) close();
  };

  return (
    <DialogPrimitive.Root open onOpenChange={handleOpenChange}>
      <DialogPrimitive.Portal>
        {/* 풀스크린: 오버레이 없음, 콘텐츠가 직접 inset-0 채움 */}
        <DialogPrimitive.Content
          className={styles.content}
          style={{ '--modal-z-index': 150 + index } as CSSProperties}
          // 모바일 풀스크린이므로 outside click 닫기 비활성
          onInteractOutside={(e) => e.preventDefault()}
        >
          <Suspense
            fallback={
              <div className={styles.loading}>로딩 중...</div>
            }
          >
            <Component {...config} />
          </Suspense>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};
