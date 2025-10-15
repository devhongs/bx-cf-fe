import { Suspense, lazy, useMemo } from 'react'
import type { ComponentType } from 'react'

import type { ModalConfig } from '@/shared/types'

const modalModules = import.meta.glob<{ default: ComponentType<any> }>(
  '/src/**/*.tsx',
  { eager: false },
)

// 자동으로 모달 경로 매핑 (폴더명 -> 전체 경로)
const modalPathMap = Object.keys(modalModules)
  .filter((path) => path.includes('/_modal/'))
  .reduce(
    (acc, path) => {
      const match = path.match(/\/_modal\/(.+)\/index\.tsx$/)
      if (match) {
        acc[match[1]] = path // 'alarm-list' -> '/src/routes/_modal/alarm-list/index.tsx'
      }
      return acc
    },
    {} as Record<string, string>,
  )

interface ModalContainerProps extends ModalConfig {
  index?: number
}

export const ModalContainer = ({
  index = 0,
  ...props
}: ModalContainerProps) => {
  const Component = useMemo(() => {
    if (!props.path) return null

    // path가 전체 경로인지 단축 키인지 확인
    const fullPath = props.path.startsWith('/')
      ? props.path
      : modalPathMap[props.path]

    if (!fullPath) {
      console.error(`Modal not found: ${props.path}`)
      return null
    }

    const importFn = modalModules[fullPath]

    return lazy(() => importFn().then((mod) => ({ default: mod.default })))
  }, [props.path])

  if (!Component) return null

  return (
    <div className="fixed inset-0 bg-white" style={{ zIndex: 150 + index }}>
      <Suspense fallback={null}>
        <Component {...props} />
      </Suspense>
    </div>
  )
}
