// TODO: 경로 수정하기
const getInfo = () => {
  const { hostname } =
    typeof window !== 'undefined' ? location : { hostname: '' }
  const isDev = hostname.includes('designsystem.bwg.co.kr') // YourDevelopUrl
  const isStg = hostname.includes('YourStageUrl') // YourStageUrl
  const isPrd = hostname.includes('YourProductionUrl') // YourProductionUrl
  const MODE = isPrd ? 'P' : isDev ? 'D' : isStg ? 'S' : 'L'
  const LOCAL_MODE =
    hostname.includes('localhost') || hostname.includes('127.0.0.1')
  return { MODE, LOCAL_MODE }
}

const info = getInfo()

const CONFIG = {
  SET_NAME: 'SET_NAME', // 이름을 변경하는 타입 정의
  ENV: {
    MODE: info.MODE,
    LOCAL_MODE: info.LOCAL_MODE,
    PHASE: process.env.APP_PHASE,
    BASE_PATH:
      process.env.NODE_ENV === 'development'
        ? ''
        : process.env.NEXT_PUBLIC_APP_BASE_PATH,
  },
  PROXY: {
    TNSN_URL: process.env.APP_TNSN_URL, // '/online/gatewayEndpoint/json'
    I18N_URL: process.env.APP_I18N_URL, // '/app/common/messages/'
  },
  SESSION: {
    CODE: '__code__', // 코드정보 (팝업 포함하지 않음)
    CORE_DATA: '_CORE_DATA_', // 코어 정보 (팝업 포함하지 않음)
    MENU_LIST: 'MENU_LIST', // 메뉴정보 (계층형 데이터)
    SCREEN_LIST: 'SCREEN_LIST', // 화면정보 (팝업 포함하지 않음)
    SCREEN_AUTH_LIST: 'SCREEN_AUTH_LIST', // 권한있는 화면정보
    URL_QUERY: 'URL_QUERY', // URL QueryString
    POPUP_IDS: 'POPUP_IDS', // POPUP_IDS
    BIZ_DATE_INFO: 'BIZ_DATE_INFO', // 영업일자 정보
    SCREEN_ID: 'scrnId', // 스크린 아이디
  },
  TIMER: {
    LOGOUT_TIMER_DELAY: 1000 * 60 * 30, // millisecond (30 minute) - 자동 로그아웃 시간
    SHOW_TIMER_SECOND: 60 * 3, // second (3 minute) - 타이머 표시될 시간
    LOGOUT_THREAD_DELAY: 1000, // millisecond (1 second) - 타이머에 초 갱신될
  },
  CRUD: {
    INIT: '',
    CREATE: 'C',
    UPDATE: 'U',
    DELETE: 'D',
  },
  BOOLEAN: {
    Y: 'Y',
    N: 'N',
  },
  MESSAGE: {
    I18N_ERROR:
      '다국어 수신 중 오류가 발생하였습니다. 관리자에게 문의하시기 바랍니다.',
  },
  DEVICE: {
    ANDROID: 'Android',
    IOS: 'iOS',
  },
  THEME: {
    DARK: 'theme-dark',
    LIGHT: 'theme-light',
  },
  CALENDAR: {
    MIN_DATE: '10000101',
    MAX_DATE: '99991231',
  },
  LIMIT_AMOUNT: {
    OUR_BANK_DAILY_TRANSFER_LIMIT: 250000,
    OTHER_BANK_DAILY_TRANSFER_LIMIT: 50000,
  },
}

export default CONFIG
