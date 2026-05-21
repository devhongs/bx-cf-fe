import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
}

export function Button({ className, children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        'py-2 px-4 rounded-md text-white bg-primary cursor-pointer disabled:bg-gray-400',
        className,
      )}
    >
      {children}
    </button>
  );
}
