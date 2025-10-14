import { type BaseProps } from '@/shared/types'

import { type Menu } from '@/entities/menu'
import styles from './index.module.css'

import IconButton from '@/shared/ui/icon-button/IconButton'

interface MenuItemProps extends BaseProps {
  data: Menu
  onMenuClick?: (menu: Menu) => void
}

export default function MenuItem({ data, onMenuClick }: MenuItemProps) {
  const { children = [], name } = data
  return (
    <div className={styles.start}>
      {/* Level 1 메뉴 */}
      <div className={styles.name}>{name}</div>
      {/* Level 2 메뉴 */}
      {children.map((d: Menu) => (
        <SubMenuItem key={d.id} data={d} onClick={() => onMenuClick?.(d)} />
      ))}
    </div>
  )
}

interface SubMenuItemProps extends BaseProps {
  data: Menu
  onClick?: () => void
}

function SubMenuItem({ data, onClick }: SubMenuItemProps) {
  const { name, icon } = data
  const strokeColorHex = Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, '0')
  return (
    <div className={styles.subMenu} onClick={onClick}>
      <IconButton type={icon} strokeColor={`#${strokeColorHex}`} />
      <span className={styles.name}>{name}</span>
    </div>
  )
}
