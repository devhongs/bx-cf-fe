import type { CodeItem } from '../types';

export const LOCAL_CODE_MAP = {
  ACCOUNT_TYPE: [
    { codeField: 'CHECKING', labelField: '입출금' },
    { codeField: 'INSTALLMENT_SAVINGS', labelField: '적금' },
    { codeField: 'CARD', labelField: '카드' },
  ],
  BANK: [
    { codeField: 'KB', labelField: 'KB국민은행' },
    { codeField: 'SH', labelField: '신한은행' },
    { codeField: 'HN', labelField: '하나은행' },
    { codeField: 'WR', labelField: '우리은행' },
    { codeField: 'NH', labelField: 'NH농협은행' },
    { codeField: 'IBK', labelField: 'IBK기업은행' },
    { codeField: 'KDB', labelField: 'KDB산업은행' },
    { codeField: 'SC', labelField: 'SC제일은행' },
    { codeField: 'CT', labelField: '씨티은행' },
    { codeField: 'KT', labelField: '케이뱅크' },
    { codeField: 'KK', labelField: '카카오뱅크' },
    { codeField: 'TS', labelField: '토스뱅크' },
  ],
  DATE_RANGE: [
    { codeField: 'TODAY', labelField: '오늘' },
    { codeField: 'ONE_WEEK', labelField: '1주일' },
    { codeField: 'ONE_MONTH', labelField: '1개월' },
    { codeField: 'THREE_MONTHS', labelField: '3개월' },
  ],
  MENU_TYPE: [
    { codeField: 'MENU', labelField: '메뉴' },
    { codeField: 'PAGE', labelField: '화면' },
  ],
  SIGNUP_USER_TYPE: [
    { codeField: 'personal', labelField: '개인' },
    { codeField: 'business', labelField: '사업자' },
  ],
  USER_STATUS: [
    { codeField: 'Y', labelField: '사용' },
    { codeField: 'N', labelField: '중지' },
  ],
  USER_TYPE: [
    { codeField: 'ADMIN', labelField: '관리자' },
    { codeField: 'SERVICE', labelField: '서비스 사용자' },
  ],
  USE_YN: [
    { codeField: 'Y', labelField: '사용' },
    { codeField: 'N', labelField: '미사용' },
  ],
  VISIBLE_YN: [
    { codeField: 'Y', labelField: '노출' },
    { codeField: 'N', labelField: '숨김' },
  ],
} as const satisfies Record<string, ReadonlyArray<CodeItem>>;

export type LocalCodeGroupCd = keyof typeof LOCAL_CODE_MAP;

/**
 * 코드 그룹 코드. 로컬 코드 그룹은 자동완성으로 돕되, 서버에만 등록된 그룹도 그대로 받는다.
 *
 * `string & Record<never, never>`는 union이 `string`으로 뭉개지는 걸 막는 관용구다.
 * 이게 없으면 TS가 전체를 `string`으로 좁혀버려 자동완성이 사라진다.
 */
export type CodeGroupCd = LocalCodeGroupCd | (string & Record<never, never>);
