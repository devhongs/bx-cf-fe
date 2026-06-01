import { Suspense, lazy } from 'react';
import type { ComponentType } from 'react';

import type { ModalConfig } from '@/shared/types';

const modalModules = import.meta.glob<Record<string, ComponentType<any>>>(
  '/src/routes/\\(modal\\)/*/*.tsx',
  { eager: false },
);

// 자동으로 모달 경로 매핑 (폴더명 -> 전체 경로)
const modalPathMap = Object.keys(modalModules).reduce(
  (acc, path) => {
    const match = path.match(/\/\(?modal\)?\/(.+)\/index\.tsx$/);
    if (match) {
      acc[match[1]] = path; // 'alarm-list' -> '/src/routes/(modal)/alarm-list/index.tsx'
    }
    return acc;
  },
  {} as Record<string, string>,
);

// lazy 컴포넌트들을 미리 생성하여 캐싱해두는 객체
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

interface ModalContainerProps extends ModalConfig {
  index?: number;
}

export const ModalContainer = ({ index = 0, ...props }: ModalContainerProps) => {
  if (!props.path) return null;

  // path가 전체 경로인지 단축 키인지 확인
  const fullPath = props.path.startsWith('/') ? props.path : modalPathMap[props.path];

  if (!fullPath) {
    console.error(`Modal not found: ${props.path}`);
    return null;
  }

  const Component = lazyModalComponents[fullPath];

  if (!Component) return null;

  return (
    <div className="fixed inset-0 bg-white" style={{ zIndex: 150 + index }}>
      <Suspense fallback={null}>
        <Component {...props} />
      </Suspense>
    </div>
  );
};
