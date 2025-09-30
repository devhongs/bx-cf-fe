import { useLocation, useNavigate } from '@tanstack/react-router'
import { Bell, LogOut } from 'lucide-react'
import { useMemo } from 'react'

import styles from './Header.module.css'

import { cn } from '@/shared/lib/utils'
import type { BaseProps } from '@/shared/types'

interface HeaderProps extends BaseProps {}

export function Header(props: HeaderProps) {
  const location = useLocation()
  const navigate = useNavigate()

  const title = useMemo(() => {
    switch (location.pathname) {
      case '/main':
        return '홈'
      case '/asset':
        return '자산'
      case '/product':
        return '상품'
      case '/menu':
        return '메뉴'
      default:
        return '/main'
    }
  }, [location])

  const handleAlarm = () => {
    // navigate({ to: '/alarm' })
  }

  const handleLogout = () => {
    sessionStorage.removeItem('sessionId')
    navigate({ to: '/login' })
  }

  return (
    <header className={cn(styles.root, props.className)}>
      <div className={styles.left}>
        <span className={styles.title}>{title}</span>
      </div>
      <div className={styles.right}>
        <button className={styles.alarm} onClick={handleAlarm}>
          <Bell />
        </button>
        <button className={styles.alarm} onClick={handleLogout}>
          <LogOut />
        </button>
      </div>
    </header>
  )
}
