import { X } from 'lucide-react';
import type { ReactNode } from 'react';

import styles from './AdminDrawer.module.css';

interface AdminDrawerProps {
  open: boolean;
  title: string;
  subtitle?: string;
  placeholder?: string;
  footer?: ReactNode;
  children: ReactNode;
  onClose: () => void;
}

export function AdminDrawer({
  open,
  title,
  subtitle,
  placeholder = '목록에서 항목을 선택하세요.',
  footer,
  children,
  onClose,
}: AdminDrawerProps) {
  return (
    <aside className={`${styles.drawer} ${open ? styles.open : ''}`}>
      {open ? (
        <>
          <header className={styles.header}>
            <div>
              <h2>{title}</h2>
              {subtitle && <p>{subtitle}</p>}
            </div>
            <button type="button" onClick={onClose} title="닫기">
              <X size={16} />
            </button>
          </header>
          <div className={styles.body}>{children}</div>
          {footer && <footer className={styles.footer}>{footer}</footer>}
        </>
      ) : (
        <div className={styles.placeholder}>{placeholder}</div>
      )}
    </aside>
  );
}
