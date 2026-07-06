import * as React from 'react';

import { cn } from '../lib/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'submit' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer';

    const variants = {
      default: 'bg-accent text-accent-foreground shadow hover:bg-accent-hover',
      submit: 'bg-accent text-accent-foreground shadow hover:bg-accent-hover',
      destructive: 'bg-red-600 text-white shadow-sm hover:bg-red-700 active:bg-red-800',
      outline:
        'border border-border bg-background text-foreground shadow-sm hover:bg-surface active:bg-surface-raised',
      secondary: 'bg-surface-raised text-foreground shadow-sm hover:bg-surface-hover',
      ghost: 'text-foreground hover:bg-surface-raised',
      link: 'text-accent underline-offset-4 hover:underline',
    };

    const sizes = {
      default: 'h-9 px-4 py-2',
      sm: 'h-8 rounded-md px-3 text-xs',
      lg: 'h-10 rounded-md px-8',
      icon: 'h-9 w-9',
    };

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button };
