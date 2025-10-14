import styles from './index.module.css'

import type { BaseProps } from '@/shared/types'

interface AlarmCardProps extends BaseProps {
  data: {
    id: number
    title: string
    description: string
  }
  onClick?: () => void
}

export default function AlarmCard({ data, onClick }: AlarmCardProps) {
  return (
    <div className={styles.start} onClick={onClick}>
      <div>{data.title}</div>
      <div>{data.description}</div>
    </div>
  )
}
