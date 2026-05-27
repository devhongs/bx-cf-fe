import type { ReactElement, ReactNode } from 'react';
import { Children, isValidElement } from 'react';

/**
 * 특정 React 컴포넌트를 children에서 찾아 반환하는 유틸 함수.
 *
 * @template T - 찾고자 하는 컴포넌트의 타입
 * @param {ReactNode} children - 탐색할 React children 요소들
 * @param {T} component - 찾고자 하는 특정 컴포넌트
 * @returns {ReactElement | undefined} - 찾은 ReactElement 또는 undefined
 *
 * @example
 * const TitleSlot = getSlot(children, ModalTitle);
 */
export const getSlot = <T>(children: ReactNode, component: T): ReactElement | undefined => {
  return Children.toArray(children).find(
    (child): child is ReactElement => isValidElement(child) && child.type === component,
  );
};
