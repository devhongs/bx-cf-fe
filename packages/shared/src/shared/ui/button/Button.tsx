import * as React from 'react';

import { cn } from '../lib/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'submit' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer';

    const variants = {
      default: 'bg-blue-600 text-white shadow hover:bg-blue-700 active:bg-blue-800',
      submit: 'bg-blue-600 text-white shadow hover:bg-blue-700 active:bg-blue-800',
      destructive: 'bg-red-600 text-white shadow-sm hover:bg-red-700 active:bg-red-800',
      outline:
        'border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50 active:bg-gray-100',
      secondary: 'bg-gray-100 text-gray-900 shadow-sm hover:bg-gray-200 active:bg-gray-300',
      ghost: 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
      link: 'text-blue-600 underline-offset-4 hover:underline',
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
