import i18next from 'i18next'

/**
 * 다국어 변환
 * @param {string} key
 * @param {object} param
 */
const initializeSSR = async (lang: string, mltlnJson: object): Promise<any> =>
  new Promise((resolve) => {
    const message = mltlnJson
    // console.log("message :: ", lang, JSON.stringify(message, null, 2))
    const options = {
      // for all options read: https://www.i18next.com/overview/configuration-options
      // debug: true,
      // lng: "ko",
      // interpolation: { escapeValue: false },
      resources: {
        [lang]: {
          translation: mltlnJson,
        },
      },
    }
    i18next
      // .use(LanguaeDetector) // 사용자 언어 탐지
      // .use(initReactI18next) // i18n 객체를 react-18next에 전달
      .init(options)

    i18next.addResourceBundle(lang, 'translation', message) // namespace1, translation
    i18next.changeLanguage(lang)
    resolve(message)
  })

export const $ssrUtils = {
  initializeSSR,
}
