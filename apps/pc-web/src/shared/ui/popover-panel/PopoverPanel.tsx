import { X } from 'lucide-react';

import { PopoverPrimitive } from '@bx/shared';

import styles from './PopoverPanel.module.css';

type Side = 'top' | 'right' | 'bottom' | 'left';
type Align = 'start' | 'center' | 'end';

interface PopoverPanelProps {
  /** 패널 헤더 제목 (생략 시 헤더 영역 없이 닫기 버튼만) */
  title?: string;
  side?: Side;
  align?: Align;
  sideOffset?: number;
  /** 닫기(X) 버튼 숨기기 */
  hideClose?: boolean;
  className?: string;
  children: React.ReactNode;
}

/**
 * 팝오버 공통 껍데기 — Portal + 다크 패널 + 헤더(제목/닫기) + 애니메이션.
 * 사용처는 내용(children)만 채우면 된다.
 *
 * @example
 * <Popover>
 *   <PopoverTrigger asChild>{trigger}</PopoverTrigger>
 *   <PopoverPanel title="계정" side="top" align="start">...</PopoverPanel>
 * </Popover>
 */
export function PopoverPanel({
  title,
  side = 'bottom',
  align = 'center',
  sideOffset = 8,
  hideClose = false,
  className,
  children,
}: PopoverPanelProps) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        side={side}
        align={align}
        sideOffset={sideOffset}
        className={[styles.content, className].filter(Boolean).join(' ')}
      >
        {(title || !hideClose) && (
          <div className={styles.header}>
            <span className={styles.headerTitle}>{title}</span>
            {!hideClose && (
              <PopoverPrimitive.Close className={styles.closeBtn} aria-label="닫기">
                <X size={16} />
              </PopoverPrimitive.Close>
            )}
          </div>
        )}
        {children}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  );
}
