import type { CSSProperties, ReactNode } from 'react';

import styles from './AppForm.module.css';

interface FieldCellProps {
  /** 12칸 기준 차지할 폭. 기본 6(=절반). 좁은 화면에서는 항상 12칸이 된다. */
  cols?: number;
  children?: ReactNode;
}

/**
 * 폼 필드가 놓일 자리만 정한다. 필드 자체(FormInput 등)는 건드리지 않는다.
 *
 * 행이라는 실체는 없고 12칸이 차면 그리드가 알아서 줄을 바꾼다.
 * 그래서 `6:6`, `4:4:4`, `6:3:3`처럼 줄마다 다른 배치를 섞어 쓸 수 있다.
 * 감싸지 않은 자식은 한 줄 전체를 쓰므로, 한 줄을 다 쓰는 필드는 감쌀 필요가 없다.
 */
export function FieldCell({ cols = 6, children }: FieldCellProps) {
  return (
    <div className={styles.cell} style={{ '--field-cols': cols } as CSSProperties}>
      {children}
    </div>
  );
}
