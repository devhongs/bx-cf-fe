import React from 'react';

import { cn } from '@/shared/lib/utils';

import styles from './FooterButton.module.css';

interface FooterButtonProps {
  label: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onClick?: () => void;
}

export function FooterButton({
  label,
  icon,
  isSelected,
  onClick = () => null,
}: FooterButtonProps) {
  return (
    <button className={cn(styles.root)} onClick={onClick}>
      <span className={cn(styles.icon, isSelected && styles.selected)}>
        {icon}
      </span>
      <span className={cn(styles.label, isSelected && styles.selected)}>
        {label}
      </span>
    </button>
  );
}
