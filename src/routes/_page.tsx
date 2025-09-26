import { Outlet, createFileRoute } from '@tanstack/react-router'

import styles from './_page.module.css'

import { Footer } from '@/widgets/layout/footer/Footer'
import { Header } from '@/widgets/layout/header/Header'

export const Route = createFileRoute('/_page')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <Header className={styles.header} />
      <main className={styles.main}>
        <div>page</div>
        <Outlet />
      </main>
      <Footer className={styles.footer} />
    </>
  )
}
