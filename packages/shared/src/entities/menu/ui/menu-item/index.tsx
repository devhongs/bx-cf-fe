import type { Menu } from '../..';
import type { BaseProps } from '../../../../shared/types';
import { IconButton } from '../../../../shared/ui';

import styles from './index.module.css';

interface MenuItemProps extends BaseProps {
  data: Menu;
  onMenuClick?: (menu: Menu) => void;
}

export function MenuItem({ data, onMenuClick }: MenuItemProps) {
  const { children = [], name } = data;
  return (
    <div className={styles.layout}>
      {/* Level 1 메뉴 */}
      <div className={styles.name}>{name}</div>
      {/* Level 2 메뉴 */}
      {children.map((d: Menu) => (
        <SubMenuItem key={d.id} data={d} onClick={() => onMenuClick?.(d)} />
      ))}
    </div>
  );
}

interface SubMenuItemProps extends BaseProps {
  data: Menu;
  onClick?: () => void;
}

function SubMenuItem({ data, onClick }: SubMenuItemProps) {
  const { name, iconType } = data;
  const iconColor = `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, '0')}`;
  return (
    <div className={styles.subMenu} onClick={onClick}>
      <IconButton iconType={iconType} iconColor={iconColor} />
      <span className={styles.name}>{name}</span>
    </div>
  );
}
