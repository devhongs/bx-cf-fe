import CONFIG from '@/shared/constants/siteConfig'

const sessionStorage =
  typeof window !== 'undefined' ? window.sessionStorage : undefined

/**
 * 세션저장 or 획득
 * @param {키} key
 * @param {값} value
 */
const session = (key: string, value?: any) =>
  key && value !== undefined
    ? sessionStorage?.setItem(key, JSON.stringify(value))
    : sessionStorage?.getItem(key)
      ? JSON.parse(sessionStorage.getItem(key) || '')
      : null

const getSession = () => sessionStorage

/**
 * 코어 세션 정보 조회
 */
const getSessionCoreData = () => session(CONFIG.SESSION.CORE_DATA)

export const $storageUtils = {
  session,
  getSession,
  getSessionCoreData,
}
