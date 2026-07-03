import type React from 'react';
import type { FC, ReactNode } from 'react';

import type { BaseProps } from '../../types';
import { cn } from '../lib/cn';
import { getSlot } from '../lib/component-util';

import styles from './Page.module.css';

export interface PageProps extends BaseProps {
  children?: ReactNode;
}

const Description: FC<{ children: ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

const Body: FC<{ children: ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

const PageComponent: React.FC<PageProps> = ({ children, className }) => {
  const BodySlot = getSlot(children, Body);

  return (
    <div className={cn(styles.layout, className, 'bx-page')}>
      {/* body */}
      <div className={cn(styles.body, 'page-body')}>{BodySlot}</div>
    </div>
  );
};

export const Page = Object.assign(PageComponent, {
  Body,
  Description,
});
