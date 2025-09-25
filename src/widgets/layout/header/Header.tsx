import { Link } from '@tanstack/react-router'

import styles from './Header.module.css'

export function Header() {
  return (
    <header className={styles.root}>
      <nav className="flex flex-row gap-4">
        <div className="px-2 font-bold">
          <Link to="/main">Home</Link>
        </div>
        <div className="px-2">
          <Link to="/main/setting">설정</Link>
        </div>
      </nav>
    </header>
  )
}
