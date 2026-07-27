import type { CSSProperties, ReactNode } from 'react';

import styles from './AdminForm.module.css';

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
 * 한 줄을 일부러 비우려면 children 없이 `<FieldCell />`로 남은 칸을 채운다.
 */
export function FieldCell({ cols = 6, children }: FieldCellProps) {
  return (
    <div className={styles.cell} style={{ '--field-cols': cols } as CSSProperties}>
      {children}
    </div>
  );
}
