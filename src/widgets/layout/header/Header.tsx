import { Link } from '@tanstack/react-router'

import styles from './Header.module.css'

export function Header() {
  return (
    <header className={styles.root}>
      <nav className={styles.nav}>
        <div className={styles.home}>
          <Link to="/main">Home</Link>
        </div>
        <div className={styles.setting}>
          <Link to="/main/setting">설정</Link>
        </div>
      </nav>
    </header>
  )
}
