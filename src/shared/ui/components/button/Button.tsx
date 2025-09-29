import type { ReactNode } from 'react'

export interface ButtonProps {
  children: ReactNode
}

export default function Button({ children }: ButtonProps) {
  return <button>{children}</button>
}
