import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type React from 'react';

import { cn } from '../../lib/utils/cn';

import styles from './IconButton.module.css';

export interface IconButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  // 버튼(아이콘 + 라벨) 크기를 지정합니다. (선택 사항)
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  // 아이콘
  icon?: LucideIcon;
  // 아이콘 유형을 지정합니다.
  iconType?: string;
  // 아이콘 & 라벨 색상을 지정합니다. (선택 사항)
  iconColor?: string;
  // 아이콘 배경을 원형으로 표시할지 여부입니다. (선택 사항)
  iconBackground?: 'circle' | 'square';
  // 아이콘 옆에 표시할 라벨입니다. (선택 사항)
  label?: string;
  // 라벨 색상을 지정합니다. (선택 사항)
  labelColor?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  size = 'md',
  icon,
  iconType = 'Circle',
  iconColor = 'currentColor',
  iconBackground,
  label = '',
  labelColor = 'currentColor',
  className,
  ...props
}) => {
  const icons = Icons as unknown as Record<string, LucideIcon | undefined>;
  const IconComponent: LucideIcon = icon ?? icons[iconType] ?? Icons.Circle;

  return (
    <button
      {...props}
      className={cn(
        styles.layout,
        className,
        iconBackground === 'circle' && styles.circle,
        iconBackground === 'square' && styles.square,
      )}
    >
      {/* 아이콘 */}
      <IconComponent className={styles.icon} stroke={iconColor} size={IconSizeMap[size]} />
      {/* 라벨 */}
      {label.length > 0 && (
        <span
          className={cn(styles.label, LabelSizeMap[size])}
          style={{ '--icon-label-color': labelColor } as React.CSSProperties}
        >
          {label}
        </span>
      )}
    </button>
  );
};

const IconSizeMap = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 28,
  xl: 32,
};

const LabelSizeMap = {
  xs: styles.labelXs,
  sm: styles.labelSm,
  md: styles.labelMd,
  lg: styles.labelLg,
  xl: styles.labelXl,
};
