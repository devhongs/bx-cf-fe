// import { parseISO, add, isValid } from "date-fns"
// import { format } from "date-fns-tz"
import { isValid, parse } from 'date-fns';
import dayjs from 'dayjs';

import { STORAGE_KEYS } from '../../constants';
import type { AddDay } from '../../types';

import { session } from './storage-util';

/**
 * 일자를 리턴한다 (전문설정일자)
 * @returns
 */
const today = () =>
  // 전문에서 일자를 가져온다.
  typeof window !== 'undefined'
    ? // 로그인을 하지 않을경우 세션에 값이 없을 수 있어 사용자 컴퓨터 날짜 Set.
      session.get<string>(STORAGE_KEYS.TX_DT) || getClientDate()
    : null;

/**
 * 연월을 리턴한다 (기본: 전문설정일자)
 * @param date : 대상일자
 * @param delimiter : 일자포멧
 * @returns
 */
const getYearMonth = (date?: any, delimiter = 'YYYYMM') => {
  if (date) {
    return dayjs(date).format(delimiter);
  }

  return dayjs(today()).format(delimiter);
};

/**
 * 연도를 리턴한다 (기본: 전문설정일자)
 * @param date : 대상일자
 * @param delimiter : 일자포멧
 * @returns
 */
const getYear = (date?: any, delimiter = 'YYYY') => {
  if (date) {
    return dayjs(date).format(delimiter);
  }

  return dayjs(today()).format(delimiter);
};

/**
 * 일자 계산
 * @param count : 증감 값
 * @param date : 대상일자
 * @param delimiter : 일자포멧
 * @returns
 */
const addDay = (count: number, date?: any, delimiter = 'YYYYMMDD') => {
  let parseDate;
  if (date) {
    parseDate = typeof date === 'object' ? date : dayjs(date);
  } else {
    parseDate = dayjs(today());
  }

  parseDate = parseDate.add(count, 'day');
  // console.log("parseDate :: ", parseDate)
  return parseDate.format(delimiter);
};

/**
 * 월 계산
 * @param count : 증감 값
 * @param date : 대상일자
 * @param delimiter : 일자포멧
 * @returns
 */
const addMonth = (count: number, date?: any, delimiter = 'YYYYMMDD') => {
  let parseDate;
  if (date) {
    parseDate = typeof date === 'object' ? date : dayjs(date);
  } else {
    parseDate = dayjs(today());
  }
  parseDate = parseDate.add(count, 'month');
  // console.log("parseDate :: ", parseDate)
  return parseDate.format(delimiter);
};

/**
 * 년 계산
 * @param count : 증감 값
 * @param date : 대상일자
 * @param delimiter : 일자포멧
 * @returns
 */
const addYear = (count: number, date?: any, delimiter = 'YYYYMMDD') => {
  let parseDate;
  if (date) {
    parseDate = typeof date === 'object' ? date : dayjs(date);
  } else {
    parseDate = dayjs(today());
  }
  parseDate = parseDate.add(count, 'year');
  // console.log("parseDate :: ", parseDate)
  return parseDate.format(delimiter);
};

/**
 * 년,월,일 계산
 * @param addValue : 증감 값
 * @param date : 대상일자
 * @param delimiter : 일자포멧
 * @returns
 */
const addDate = (addValue: AddDay, date?: any, delimiter = 'YYYYMMDD') => {
  let parseDate;
  if (date) {
    parseDate = typeof date === 'object' ? date : dayjs(date);
  } else {
    parseDate = dayjs(today());
  }
  if (addValue.year) {
    parseDate = parseDate.add(addValue.year, 'year');
  }
  if (addValue.month) {
    parseDate = parseDate.add(addValue.month, 'month');
  }
  if (addValue.day) {
    parseDate = parseDate.add(addValue.day, 'day');
  }
  // console.log("parseDate :: ", parseDate)
  return parseDate.format(delimiter);
};

/**
 * 유효한 날짜인지 체크
 * @param {String} text : 날짜 문자열
 * @return {Boolean}
 */
const isValidDate = (text: string) => {
  if (!text) {
    return false;
  }

  const value = (text || '').replace(/[^0-9]/g, '');
  if (!value || value.length !== 8) {
    return false;
  }

  const date = parse(value, 'yyyyMMdd', new Date());
  return isValid(date);
};

/**
 * 유효한 월인지 체크
 * @param {String} text : 날짜 문자열
 * @return {Boolean}
 */
const isValidMonth = (text: string) => {
  if (!text || text.length !== 6) {
    return false;
  }

  // "YYYYMM" 형식인지 검사하는 정규 표현식
  const regex = /^(^\d{4})(0[1-9]|1[0-2])$/;

  if (!regex.test(text)) {
    return false;
  }

  if (Number(text) <= 100000) {
    return false;
  }

  return true;
};

/**
 * 유효한 연도인지 체크
 * @param {String} text : 날짜 문자열
 * @return {Boolean}
 */
const isValidYear = (text: string) => {
  if (!text || text.length !== 4) {
    return false;
  }

  // "YYYY" 형식인지 검사하는 정규 표현식
  const regex = /^\d{4}$/;

  if (!regex.test(text)) {
    return false;
  }

  if (Number(text) < 1000) {
    return false;
  }

  return true;
};

/**
 * Client OS Date Return
 * @returns
 */
const getClientDate = () => {
  const date = new Date();
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return year + month + day;
};

export const $dateUtils = {
  today,
  getYearMonth,
  getYear,
  addDay,
  addMonth,
  addYear,
  addDate,
  isValidDate,
  isValidMonth,
  isValidYear,
};
