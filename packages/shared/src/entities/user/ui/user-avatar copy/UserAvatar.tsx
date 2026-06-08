import type { BaseProps } from '../../../../shared/types';

import styles from './UserAvatar.module.css';

interface UserAvatarProps extends BaseProps {
  name: string;
  imageUrl?: string;
  size?: number;
  showName?: boolean;
}

export function UserAvatar({
  name,
  imageUrl = '/assets/images/avatar/avatar-men.svg',
  size = 50,
  showName,
}: UserAvatarProps) {
  return (
    <div className={styles.layout}>
      <img
        src={imageUrl}
        alt={`${name}의 아바타`}
        className={styles.image}
        style={{ width: size, height: size }}
      />
      {showName && name && <span className={styles.name}>{name}</span>}
    </div>
  );
}
