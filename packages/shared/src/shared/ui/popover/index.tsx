import * as PopoverPrimitive from '@radix-ui/react-popover';
import * as React from 'react';

import { cn } from '../lib/cn';

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverAnchor = PopoverPrimitive.Anchor;
const PopoverClose = PopoverPrimitive.Close;

/* ── Content ── */
const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = 'center', sideOffset = 8, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        // 크기
        'z-50 w-72',
        // 모양
        'rounded-xl border border-white/10 bg-white shadow-xl',
        'p-4',
        // 애니메이션 (Dialog와 동일 패턴)
        'transition-all duration-200',
        'data-[state=open]:opacity-100 data-[state=open]:scale-100',
        'data-[state=closed]:opacity-0 data-[state=closed]:scale-95',
        'focus:outline-none',
        className,
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export {
  Popover,
  PopoverTrigger,
  PopoverAnchor,
  PopoverClose,
  PopoverContent,
  // raw Radix 네임스페이스 재노출 — 앱에서 직접 의존성 추가 없이 사용
  PopoverPrimitive,
};
