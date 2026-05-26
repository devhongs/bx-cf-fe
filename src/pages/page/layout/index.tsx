import { Outlet } from '@tanstack/react-router';

import { Footer } from '@/widgets/layout/footer/Footer';
import { Header } from '@/widgets/layout/header/Header';

import styles from './index.module.css';

export function PageLayout() {
  return (
    <div className={styles.layout}>
      <Header className={styles.header} />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer className={styles.footer} />
    </div>
  );
}
