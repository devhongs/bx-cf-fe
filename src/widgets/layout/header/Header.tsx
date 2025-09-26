import { Link } from '@tanstack/react-router'

import styles from './Header.module.css'

import { cn } from '@/shared/lib/utils'
import type { BaseProps } from '@/shared/types'

interface HeaderProps extends BaseProps {}

export function Header(props: HeaderProps) {
  return (
    <header className={cn(styles.root, props.className)}>
      <nav className={styles.nav}>
        <div className={styles.home}>
          <Link to="/main">Home</Link>
        </div>
        <div className={styles.setting}>
          <Link to="/setting">설정</Link>
        </div>
      </nav>
    </header>
  )
}
