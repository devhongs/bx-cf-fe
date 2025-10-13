import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

import styles from './_page.module.css'

import { Footer } from '@/widgets/layout/footer/Footer'
import { Header } from '@/widgets/layout/header/Header'

export const Route = createFileRoute('/_page')({
  component: RouteComponent,
  beforeLoad: ({ location, context, params, search, preload, route }: any) => {
    // 권한 체크에 이슈가 있으면 로그인 페이지 이동
    if (!checkAuth()) {
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
    <div className={styles.root}>
      <Header className={styles.header} />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer className={styles.footer} />
    </div>
  )
}

const checkAuth = () => {
  const sessionId = sessionStorage.getItem('sessionId')
  return !!sessionId
}
