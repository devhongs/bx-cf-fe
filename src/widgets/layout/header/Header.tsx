import { Link } from '@tanstack/react-router'
import styles from './Header.module.css'

export default function Header() {
  return (
    <header className={`${styles.root}`}>
      <div className=""></div>
      <nav className="flex flex-row">
        <div className="px-2 font-bold">
          <Link to="/">Home</Link>
        </div>
      </nav>
    </header>
  )
}
