import { useFetchMenuList } from '@bx/shared';
import type { Menu } from '@bx/shared';
import { MenuItem } from '@bx/shared';
import type { BaseProps } from '@bx/shared';

import styles from './index.module.css';

interface MenuListProps extends BaseProps {
  dummy?: any;
}

export function MenuList({ dummy: _dummy, className, ...rest }: MenuListProps) {
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
