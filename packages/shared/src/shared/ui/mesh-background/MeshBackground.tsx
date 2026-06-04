import React from 'react';
import { cn } from '../lib/cn';
import styles from './MeshBackground.module.css';

export type MeshBackgroundTheme = 'purple' | 'blue' | 'green' | 'slate' | 'cream';

export interface MeshBackgroundProps {
  theme?: MeshBackgroundTheme;
}

export const MeshBackground: React.FC<MeshBackgroundProps> = ({ theme = 'cream' }) => {
  // Safe mapping of theme class, default to theme-cream if not found or blank
  const themeClass = styles[`theme-${theme}`] || styles['theme-cream'];

  return (
    <div className={cn(styles.root, themeClass)}>
      {/* Waving fluid base */}
      <div className={styles.meshBg} />
      {/* Floating lava-lamp organic shape blobs */}
      <div className={styles.blob1} />
      <div className={styles.blob2} />
      <div className={styles.blob3} />
    </div>
  );
};
