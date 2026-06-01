import { format, parseISO } from 'date-fns';

/**
 * 일자 포멧팅
 * @param data : 일자
 * @returns
 */
const dateFormat = (data: any, returnFormat = 'yyyy-MM-dd') => {
  if (!data) {
    return data;
  }

  const parseDate = parseISO(data);
  // console.log("parseDate :: ", parseDate)
  return format(parseDate, returnFormat);
};

/**
 * 시간 포멧팅
 * @param data : 시간
 * @returns
 */
const timeFormat = (data: any) => {
  if (!data) {
    return data;
  }

  const clean = String(data).replace(/\D/g, '');
  if (clean.length === 6) {
    return `${clean.substring(0, 2)}:${clean.substring(2, 4)}:${clean.substring(4, 6)}`;
  }
  if (clean.length === 4) {
    return `${clean.substring(0, 2)}:${clean.substring(2, 4)}`;
  }
  return data;
};

/**
 * 일자, 시간 포멧팅
 * @param data : 일시
 * @returns
 */
const dateTimeFormat = (data: any) => {
  if (!data || data.length < 8) {
    return data;
  }

  const date = data.substring(0, 8);
  const time = data.substring(8);
  return `${dateFormat(date)} ${timeFormat(time)}`;
};

/**
 * 타임스탬프 포멧팅
 * @param data : 타임스탬프
 * @returns
 */
const timeStampToDateTimeFormat = (data: any) => {
  if (!data || data.length < 16) {
    return data;
  }

  const dateTime = data.split('T');
  return `${dateTime[0]} ${dateTime[1].substring(0, 8)}`;
};

/**
 * 타임밀리세컨드 포멧팅
 * @param data : 타임밀리세컨드
 * @returns
 */
const timeMillisecondFormat = (data: any) => {
  if (!data || data.length < 9) {
    return data;
  }

  const time = data.substring(0, 2);
  const minute = data.substring(2, 4);
  const second = data.substring(4, 6);
  const millisecond = data.substring(6);
  return `${time}:${minute}:${second}.${millisecond}`;
};

/**
 * 금액 포멧팅
 * @param data : 금액
 * @param scale
 * @returns
 */
const currencyFormat = (data: any, scale = 0) => {
  if (data === null || data === undefined || data === '') {
    return '';
  }
  const num = Number(data);
  if (isNaN(num)) return data;
  return num.toLocaleString('en-US', {
    minimumFractionDigits: scale,
    maximumFractionDigits: scale,
  });
};

/**
 * 문자열 변환 처리
 * $formatUtils.format("{0} + {1} = {2}", 4, 5, 9)
 * @param value 변환 대상 데이터
 * @param args 변경 파라미터
 * @returns
 */
const paramsFormat = (value: string, ...args: any) => {
  // if (!data) return data
  if (args?.length > 0) {
    for (const arg in args) {
      value = value.replace(`{${arg}}`, args[arg]);
    }
  }
  return value;
};

/**
 * snake case 를 camel case 로 변환 한다.
 * @param str
 * @returns camel case
 */
const convertSnakeToCamel = (str: string) => {
  if (str) {
    return str.toLowerCase().replace(/(_[a-z])/g, (arg) => arg.toUpperCase().replace('_', ''));
  }

  return '';
};

/**
 * camel case 를 snake case 로 변환 한다.
 * @param str
 * @returns snake case
 */
const convertCamelToSnake = (str: string) => {
  if (str) {
    return str.replace(/([A-Z])/g, (arg) => `_${arg.toLowerCase()}`).toUpperCase();
  }

  return '';
};

export const $formatUtils = {
  dateFormat,
  timeFormat,
  dateTimeFormat,
  timeStampToDateTimeFormat,
  timeMillisecondFormat,
  currencyFormat,
  paramsFormat,
  convertSnakeToCamel,
  convertCamelToSnake,
};
