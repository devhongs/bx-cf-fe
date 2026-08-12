import { cn } from '@bx/shared';
import type React from 'react';

import styles from './FooterButton.module.css';

interface FooterButtonProps {
  label: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onClick?: () => void;
}

export function FooterButton({ label, icon, isSelected, onClick = () => null }: FooterButtonProps) {
  return (
    <button
      type="button"
      className={cn(styles.root, isSelected && styles.selected)}
      onClick={onClick}
    >
      <span className={cn(styles.icon)}>{icon}</span>
      <span className={cn(styles.label)}>{label}</span>
    </button>
  );
}
