import { redirect } from '@tanstack/react-router'

export const requireAuth = ({ location, context }: any) => {
  const isLoggedIn = checkLogin()
  if (!isLoggedIn) {
    throw redirect({
      to: '/login',
      search: { redirect: location.href },
    })
  }
  return { ...context, state: location?.state }
}

const checkLogin = (): boolean => {
  const sessionId = sessionStorage.getItem('sessionId')
  return !!sessionId
}
