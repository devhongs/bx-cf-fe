import { lazy, Suspense, useMemo, type ComponentType } from 'react'

import { type ModalConfig } from '@/shared/types'

const modalModules = import.meta.glob<{ default: ComponentType<any> }>(
  '/src/**/*.tsx', // TODO: 모듈 경로 수정
  { eager: false },
)

export const ModalContainer = (props: ModalConfig) => {
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
    <Suspense fallback={null}>
      <Component {...props} />
    </Suspense>
  )
}
