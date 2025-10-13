import { type BaseProps } from '@/shared/types'

import { useFetchMenus, type Menu } from '@/entities/menu'
import MenuItem from '@/entities/menu/ui/menu-item'
import styles from './index.module.css'

interface MenuListProps extends BaseProps {
  dummy?: any
}

export default function MenuList({ dummy }: MenuListProps) {
  const { data } = useFetchMenus()
  const content = data?.content ?? []

  const handleMenuClick = (menu: Menu) => {
    console.log(menu)
  }

  return (
    <div className={styles.start}>
      {content.map((d: Menu) => (
        <MenuItem key={d.id} data={d} onMenuClick={handleMenuClick} />
      ))}
    </div>
  )
}
