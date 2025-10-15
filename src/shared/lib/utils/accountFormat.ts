import type { BankId } from '@/entities/account'

/** 은행별 포맷 규칙 정의 */
export interface BankFormatRule {
  /**
   * 그룹핑 전략
   *  - 정적: [3,3,6] 처럼 고정 배열
   *  - 동적: 길이에 따라 달리 하고 싶으면 (len) => number[] 로 제공
   */
  groups: Array<number> | ((len: number) => Array<number>)
  /** 구분자 (기본 '-') */
  separator?: string
  /** 사전 정규화 훅: 숫자만 추출, 특정 prefix 제거 등 */
  normalize?: (raw: string) => string
}

/** 샘플 규칙 */
export const BANK_FORMATS: Partial<Record<BankId, BankFormatRule>> = {
  KB: {
    // 국민은행 (예시)
    groups: (len) => (len === 12 ? [3, 3, 6] : [3, 2, 7]), // 제품에 따라 달라질 수 있음
  },
  SHINHAN: {
    // 신한 (예시)
    groups: [3, 3, 6],
  },
  WOORI: {
    // 우리 (예시)
    groups: (len) => (len === 12 ? [4, 2, 6] : [3, 3, 6]),
  },
  HANA: {
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
  KAKAO: {
    // 카카오뱅크 (예시)
    groups: (len) => (len === 11 ? [4, 2, 5] : [3, 3, 5]),
  },
  TOSS: {
    // 토스뱅크 (예시)
    groups: (len) => (len === 12 ? [4, 3, 5] : [3, 3, 6]),
  },
  ETC: {
    // 기타/모름: 범용 기본값
    groups: (len) => (len >= 12 ? [3, 3, len - 6] : [3, len - 3]), // 3-3-나머지
  },
}

/** 숫자만 추출 */
const onlyDigits = (input: string | number): string =>
  String(input).replace(/\D/g, '')

/** 그룹 배열대로 분할 후 구분자 결합 */
const joinByGroups = (
  digits: string,
  groups: Array<number>,
  sep: string,
): string => {
  const parts: Array<string> = []
  let i = 0
  for (const g of groups) {
    if (i >= digits.length) break
    parts.push(digits.slice(i, i + g))
    i += g
  }
  // 남는 숫자가 있으면 마지막에 붙이기 (예외 상황 대비)
  if (i < digits.length) parts.push(digits.slice(i))
  return parts.join(sep)
}

/**
 * 은행별 계좌번호 포맷팅
 * @param bankId 은행 식별자
 * @param accountNo 원본 계좌번호 (number|string)
 * @param fallback 은행 규칙을 못 찾았을 때 사용할 기본 구분자 (기본 '-')
 */
export const formatAccountNumberByBank = (
  bankId: BankId,
  accountNo: number | string,
  fallback: BankFormatRule = {
    groups: (len) => (len >= 12 ? [3, 3, len - 6] : [3, len - 3]),
  },
): string => {
  const raw = String(accountNo)
  const baseRule = BANK_FORMATS[bankId] ?? fallback
  const sep = baseRule.separator ?? '-'
  const normalized = (baseRule.normalize ?? onlyDigits)(raw)

  const groups =
    typeof baseRule.groups === 'function'
      ? baseRule.groups(normalized.length)
      : baseRule.groups

  return joinByGroups(normalized, groups, sep)
}
