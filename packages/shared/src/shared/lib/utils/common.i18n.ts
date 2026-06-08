import i18next from 'i18next';

/**
 * 다국어 변환
 * @param {string} key
 * @param {object} param
 * @param {string} defaultMessage : 키가 없는 경우 출력할 메세지
 */
const trans = (key: string, param?: any, defaultMessage?: string): any => {
  // const { t } = useTranslation()
  // return t(key, param)
  // console.log("key param msg :: ", key, param, msg)

  let message: any = '';
  if (i18next.exists(key)) {
    message = i18next.t(i18next.t(key).replace(/\{(\d)\}/gi, '{{$1}}'), param);
  } else {
    message = key;
    // console.error(`다국어 키를 확인해 주시기 바랍니다. key:: ${key}`)
    if (defaultMessage) {
      return defaultMessage;
    }
  }
  return message;
};

/**
 * 전체 다국어 data 가져오기
 * @returns
 */
const getDataByLanguage = (): any => i18next.getDataByLanguage(i18next.language)?.translation;

/**
 * 다국어 코드 가져오기
 * @returns
 */
const getLanguage = (): any => i18next.language;

/*
const _convertor = (obj: any, detailKey: any): any => {
  const message: any = {};
  Object.keys(obj).forEach((key: any) => {
    const msg = obj[key];
    message[key] = msg[detailKey];
  });
  console.log('message :: ', JSON.stringify(message));
};
*/

export const $i18nUtils = {
  trans,
  getDataByLanguage,
  getLanguage,
};
