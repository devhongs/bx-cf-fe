import { Bell, Settings } from 'lucide-react'

import { useModal } from '@/shared/hooks/useModal'
import type { BaseProps } from '@/shared/types'
import { IconButton } from '@/shared/ui'

import styles from './HeaderRight.module.css'

interface HeaderRightProps extends BaseProps {
  pageTitle: string
}

export function HeaderRight({ pageTitle }: HeaderRightProps) {
  const { open: openModal } = useModal()

  const handleAlarm = () => {
    openModal({
      path: 'alarm-list', // 폴더명만 입력!
    })
  }

  const handleSettingClick = () => {
    openModal({
      path: 'setting',
    })
  }

  if (pageTitle === '메뉴') {
    return (
      <>
        <IconButton
          className={styles.icon}
          size="sm"
          icon={Settings}
          label="설정"
          onClick={handleSettingClick}
        />
      </>
    )
  }

  return (
    <>
      <IconButton icon={Bell} onClick={handleAlarm} />
    </>
  )
}
