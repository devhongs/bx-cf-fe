import * as Icons from 'lucide-react'

import { cn } from '@/shared/lib/utils'
import { type BaseProps } from '@/shared/types'
import styles from './IconButton.module.css'

export interface IconButtonProps extends BaseProps {
  // 아이콘 유형을 지정합니다.
  type: string
  // 아이콘 크기를 지정합니다. (선택 사항)
  size?: number
  // 아이콘 외곽선 색상을 지정합니다. (선택 사항)
  strokeColor?: string
  // 아이콘 배경을 원형으로 표시할지 여부입니다. (선택 사항)
  circleBackground?: boolean
  // 아이콘 옆에 표시할 라벨입니다. (선택 사항)
  label?: string
}

export default function IconButton({
  type,
  size,
  strokeColor,
  circleBackground,
  label,
}: IconButtonProps) {
  const IconComponent = (Icons[type as keyof typeof Icons] ||
    Icons['Circle']) as Icons.LucideIcon

  return (
    <button className={cn(styles.start, circleBackground && styles.circle)}>
      {/* 아이콘 */}
      <IconComponent className={styles.icon} stroke={strokeColor} size={size} />
      {/* 라벨 */}
      {label && <span className={styles.label}>{label}</span>}
    </button>
  )
}
