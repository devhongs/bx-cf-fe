import { lazy, Suspense, useMemo, type ComponentType } from 'react'

import { type ModalConfig } from '@/shared/types'

const modalModules = import.meta.glob<{ default: ComponentType<any> }>(
  '/src/**/*.tsx', // TODO: 모듈 경로 수정
  { eager: false },
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

    const importFn = modalModules[props.path]

    if (!importFn) {
      console.error(`Modal not found: ${props.path}`)
      return null
    }

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
