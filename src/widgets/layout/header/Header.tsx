import { Bell } from 'lucide-react'

import styles from './Header.module.css'

import { cn } from '@/shared/lib/utils'
import type { BaseProps } from '@/shared/types'

interface HeaderProps extends BaseProps {}

export function Header(props: HeaderProps) {
  return (
    <header className={cn(styles.root, props.className)}>
      <div className={styles.left}>
        <span className={styles.nickname}>닉네임</span>
      </div>
      <div className={styles.right}>
        <button className={styles.alarm}>
          <Bell className={styles.bell} />
        </button>
      </div>
    </header>
  )
}
