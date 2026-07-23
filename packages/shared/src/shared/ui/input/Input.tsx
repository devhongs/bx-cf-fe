import * as React from 'react';

import { cn } from '../../lib/utils/cn';
import styles from './Input.module.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onEnter?: () => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, onEnter, onKeyDown, ...props }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && onEnter) {
        onEnter();
      }
      if (onKeyDown) {
        onKeyDown(e);
      }
    };

    return (
      <input
        type={type}
        className={cn(styles.input, className)}
        ref={ref}
        onKeyDown={handleKeyDown}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export { Input };
