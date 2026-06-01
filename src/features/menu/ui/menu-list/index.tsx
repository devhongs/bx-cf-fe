import { useFetchMenuList } from '@/entities/menu';
import type { Menu } from '@/entities/menu';
import { MenuItem } from '@/entities/menu/ui/menu-item';
import type { BaseProps } from '@/shared/types';

import styles from './index.module.css';

interface MenuListProps extends BaseProps {
  dummy?: any;
}

export function MenuList({ dummy, className, ...rest }: MenuListProps) {
  const { data } = useFetchMenuList();
  const content = data ?? [];

  const handleMenuClick = (menu: Menu) => {
    console.log(menu);
  };

  return (
    <div className={`${styles.layout} ${className ?? ''}`} {...rest}>
      {content.map((d: Menu) => (
        <MenuItem key={d.id} data={d} onMenuClick={handleMenuClick} />
      ))}
    </div>
  );
}
