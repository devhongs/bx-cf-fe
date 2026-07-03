import { Suspense, lazy } from 'react';
import type { ComponentType } from 'react';

import { Dialog, DialogContent } from '@bx/shared';
import type { ModalConfig } from '@bx/shared';
import { useModalStore } from '@bx/shared';

/* ── 모달 컴포넌트 레지스트리 ── */
const modalModules = import.meta.glob<Record<string, ComponentType<any>>>(
  '/src/routes/\\(modal\\)/**/index.tsx',
  { eager: false },
);

const modalPathMap = Object.keys(modalModules).reduce(
  (acc, path) => {
    // '/src/routes/(modal)/setting/index.tsx' → 'setting'
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

export function ModalContainer({ index = 0, ...config }: ModalContainerProps) {
  const { close } = useModalStore();

  const fullPath = config.path?.startsWith('/') ? config.path : modalPathMap[config.path ?? ''];

  if (!fullPath) {
    if (config.path) console.error(`[pc-web] Modal not found: ${config.path}`);
    return null;
  }

  const Component = lazyModalComponents[fullPath];
  if (!Component) return null;

  const handleOpenChange = (open: boolean) => {
    if (!open) close();
  };

  return (
    <Dialog open onOpenChange={handleOpenChange}>
      <DialogContent
        /* pc-web 다크 테마 */
        className="border-[#2a2a2c] bg-[#1e1f21] text-[#e3e3e3] max-w-xl"
        style={{ zIndex: 200 + index }}
        hideClose
      >
        <Suspense
          fallback={
            <div className="flex h-40 items-center justify-center text-sm text-gray-400">
              로딩 중...
            </div>
          }
        >
          <Component {...config} />
        </Suspense>
      </DialogContent>
    </Dialog>
  );
}
