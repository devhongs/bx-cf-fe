import { LoaderIcon } from 'lucide-react';
import type * as React from 'react';

import { cn } from '../../lib/utils/cn';

import styles from './Spinner.module.css';

export function Spinner({
  className,
  'aria-label': ariaLabel = '로딩 중',
  ...props
}: React.ComponentProps<'svg'>) {
  return (
    <LoaderIcon
      role="status"
      aria-label={ariaLabel}
      className={cn(styles.spinner, className)}
      data-slot="spinner"
      {...props}
    />
  );
}
