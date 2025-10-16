import { useNavigate } from '@tanstack/react-router'

import { useModal } from '@/shared/hooks/useModal'
import type { BaseProps } from '@/shared/types'
import { IconButton } from '@/shared/ui'

import styles from './HeaderRight.module.css'

interface HeaderRightProps extends BaseProps {
  pageTitle: string
}

export function HeaderRight({ pageTitle }: HeaderRightProps) {
  const navigate = useNavigate()
  const { open: openModal } = useModal()

  const handleAlarm = async () => {
    const result = await openModal({
      path: 'alarm-list', // 폴더명만 입력!
    })
    console.log(result)
  }

  const handleLogout = () => {
    sessionStorage.removeItem('sessionId')
    navigate({ to: '/login' })
  }

  if (pageTitle === '메뉴') {
    return (
      <>
        <IconButton
          className={styles.icon}
          size="sm"
          type="Settings"
          label="설정"
        />
        <IconButton
          size="sm"
          type="LogOut"
          onClick={handleLogout}
          label="로그아웃"
        />
      </>
    )
  }

  return (
    <>
      <IconButton type="Bell" onClick={handleAlarm} />
    </>
  )
}
