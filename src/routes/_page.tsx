import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

import styles from './_page.module.css'

import { Footer } from '@/widgets/layout/footer/Footer'
import { Header } from '@/widgets/layout/header/Header'

export const Route = createFileRoute('/_page')({
  component: RouteComponent,
  beforeLoad: ({ location, context, params, search, preload, route }: any) => {
    // check auth
    const invalidAuth = !checkAuth()

    console.log(invalidAuth)

    if (invalidAuth) {
      console.log('gogogogogo')
      throw redirect({
        to: '/login',
        search: { redirect: location.pathname },
      })
    }
    return { ...context, state: location?.state }
  },
})

function RouteComponent() {
  return (
    <>
      <Header className={styles.header} />
      <main className={styles.main}>
        <div>페이지 내용</div>
        <Outlet />
      </main>
      <Footer className={styles.footer} />
    </>
  )
}

const checkAuth = () => {
  const sessionId = sessionStorage.getItem('sessionId')
  return !!sessionId
}
