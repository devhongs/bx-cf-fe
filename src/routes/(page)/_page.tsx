import { Outlet, createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '@/shared/guards'
import { Footer } from '@/widgets/layout/footer/Footer'
import { Header } from '@/widgets/layout/header/Header'

import styles from './_page.module.css'

export const Route = createFileRoute('/(page)/_page')({
  component: RouteComponent,
  beforeLoad: requireAuth,
})

function RouteComponent() {
  return (
    <div className={styles.layout}>
      <Header className={styles.header} />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer className={styles.footer} />
    </div>
  )
}
