import type { BankId } from '../../../entities/account/model/account.type';

/** 은행별 포맷 규칙 정의 */
export interface BankFormatRule {
  /**
   * 그룹핑 전략
   *  - 정적: [3,3,6] 처럼 고정 배열
   *  - 동적: 길이에 따라 달리 하고 싶으면 (len) => number[] 로 제공
   */
  groups: Array<number> | ((len: number) => Array<number>);
  /** 구분자 (기본 '-') */
  separator?: string;
  /** 사전 정규화 훅: 숫자만 추출, 특정 prefix 제거 등 */
  normalize?: (raw: string) => string;
}

/** 샘플 규칙 */
export const BANK_FORMATS: Partial<Record<BankId, BankFormatRule>> = {
  KB: {
    // 국민은행 (예시)
    groups: (len) => (len === 12 ? [3, 3, 6] : [3, 2, 7]), // 제품에 따라 달라질 수 있음
  },
  SH: {
    // 신한 (예시)
    groups: [3, 3, 6],
  },
  WR: {
    // 우리 (예시)
    groups: (len) => (len === 12 ? [4, 2, 6] : [3, 3, 6]),
  },
  HN: {
    // 하나 (예시)
    groups: [3, 3, 6],
  },
  NH: {
    // 농협 (예시)
    groups: (len) => (len === 12 ? [3, 4, 5] : [3, 4, 4]),
  },
  IBK: {
    // 기업 (예시)
    groups: [3, 3, 6],
  },
  KK: {
    // 카카오뱅크 (예시)
    groups: (len) => (len === 11 ? [4, 2, 5] : [3, 3, 5]),
  },
  TS: {
    // 토스뱅크 (예시)
    groups: (len) => (len === 12 ? [4, 3, 5] : [3, 3, 6]),
  },
  KDB: {
    // 산업은행 (일반적으로 12자리, 3-2-7 또는 3-3-6)
    groups: (len) => (len === 12 ? [3, 2, 7] : [3, 3, len - 6]),
  },
  SC: {
    // SC제일은행 (계좌번호 11~12자리, 보통 3-2-6)
    groups: (len) => (len >= 11 ? [3, 2, len - 5] : [3, len - 3]),
  },
  CT: {
    // 씨티은행 (10~11자리, 보통 3-3-5)
    groups: (len) => (len === 10 ? [3, 3, 4] : [3, 3, len - 6]),
  },
  KT: {
    // 케이뱅크 (보통 12자리, 3-3-6 형태)
    groups: (len) => (len === 12 ? [3, 3, 6] : [3, len - 3]),
  },

  ETC: {
    // 기타/모름: 범용 기본값
    groups: (len) => (len >= 12 ? [3, 3, len - 6] : [3, len - 3]), // 3-3-나머지
  },
};

/** 숫자만 추출 */
const onlyDigits = (input: string | number): string => String(input).replace(/\D/g, '');

/** 그룹 배열대로 분할 후 구분자 결합 */
const joinByGroups = (digits: string, groups: Array<number>, sep: string): string => {
  const parts: Array<string> = [];
  let i = 0;
  for (const g of groups) {
    if (i >= digits.length) break;
    parts.push(digits.slice(i, i + g));
    i += g;
  }
  // 남는 숫자가 있으면 마지막에 붙이기 (예외 상황 대비)
  if (i < digits.length) parts.push(digits.slice(i));
  return parts.join(sep);
};

/**
 * 은행별 계좌번호 포맷팅
 * @param bankId 은행 식별자 (없으면 fallback 규칙 사용)
 * @param accountNo 원본 계좌번호 (number|string)
 * @param fallback 은행 규칙을 못 찾았을 때 사용할 기본 구분자 (기본 '-')
 */
export const formatAccountNumberByBank = (
  bankId: BankId | undefined,
  accountNo: number | string,
  fallback: BankFormatRule = {
    groups: (len) => (len >= 12 ? [3, 3, len - 6] : [3, len - 3]),
  },
): string => {
  const raw = String(accountNo);
  if (!raw) return ''; // 계좌번호가 비어있으면 그대로 반환

  // 규칙 선택: bankId가 없거나 매핑이 없으면 fallback
  const baseRule: BankFormatRule = (bankId ? BANK_FORMATS[bankId] : undefined) ?? fallback;

  const sep = baseRule.separator ?? '-';
  const normalized = (baseRule.normalize ?? onlyDigits)(raw);

  if (!normalized) return ''; // 모두 비숫자였던 경우 등

  const groups =
    typeof baseRule.groups === 'function' ? baseRule.groups(normalized.length) : baseRule.groups;

  return joinByGroups(normalized, groups, sep);
};
