import type { BaseProps } from '@/shared/types'
import IconButton from '@/shared/ui/icon-button/IconButton'
import styles from './HeaderLeft.module.css'

interface HeaderLeftProps extends BaseProps {
  pageTitle: string
}

export function HeaderLeft({ pageTitle }: HeaderLeftProps) {
  const handleUserNameClick = () => {
    alert('사용자명 클릭')
  }

  if (pageTitle === '메뉴') {
    return (
      <span className={styles.title} onClick={handleUserNameClick}>
        사용자명
        <IconButton
          className={styles.icon}
          type="ChevronRight"
          strokeColor="#888888"
        />
      </span>
    )
  }

  return <span className={styles.title}>{pageTitle}</span>
}
