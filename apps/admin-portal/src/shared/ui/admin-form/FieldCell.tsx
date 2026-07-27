import type { CSSProperties, ReactNode } from 'react';

import styles from './AdminForm.module.css';

interface FieldCellProps {
  /** 12칸 기준 차지할 폭. 기본 12(=한 줄 전체). 좁은 화면에서는 항상 12칸이 된다. */
  cols?: number;
  children?: ReactNode;
}

/**
 * 필드를 한 줄에 여러 개 놓고 싶을 때만 쓴다. 필드 자체(FormInput 등)는 건드리지 않는다.
 *
 * 기본이 한 줄 전체라, 감싸지 않은 필드와 폭이 같다.
 * 좁게 쓸 때만 `cols`를 준다: `<FieldCell cols={6}>`이면 한 줄에 둘.
 *
 * 행이라는 실체는 없고 12칸이 차면 그리드가 알아서 줄을 바꾼다.
 * 그래서 `6:6`, `4:4:4`, `6:3:3`처럼 줄마다 다른 배치를 섞어 쓸 수 있다.
 * 한 줄을 일부러 비우려면 children 없이 `<FieldCell cols={6} />`로 남은 칸을 채운다.
 */
export function FieldCell({ cols = 12, children }: FieldCellProps) {
  return (
    <div className={styles.cell} style={{ '--field-cols': cols } as CSSProperties}>
      {children}
    </div>
  );
}
