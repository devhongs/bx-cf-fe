import React from 'react';
import type { FC, ReactNode } from 'react';

import { cn, getSlot } from '../../lib/utils';
import type { BaseProps } from '../../types';

import styles from './Page.module.css';

export interface PageProps extends BaseProps {
  children?: React.ReactNode;
}

const PageComponent: React.FC<PageProps> = ({ children, className }) => {
  const BodySlot = getSlot(children, PageBody);

  return (
    <div className={cn(styles.layout, className, 'bx-page')}>
      {/* body */}
      <div className={cn(styles.body, 'page-body')}>{BodySlot}</div>
    </div>
  );
};

export const Page = PageComponent;

/**
 * ModalDescription
 * @param children
 * @constructor
 */
export const PageDescription: FC<{ children: ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

/**
 * ModalBody
 * @param children
 * @constructor
 */
export const PageBody: FC<{ children: ReactNode }> = ({ children }) => {
  return <>{children}</>;
};
