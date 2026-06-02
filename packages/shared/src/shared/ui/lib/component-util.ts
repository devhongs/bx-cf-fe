import type { ReactElement, ReactNode } from 'react';
import { Children, isValidElement } from 'react';

export const getSlot = <T>(children: ReactNode, component: T): ReactElement | undefined => {
  return Children.toArray(children).find(
    (child): child is ReactElement => isValidElement(child) && child.type === component,
  );
};
