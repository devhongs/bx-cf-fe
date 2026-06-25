import { CONFIG } from '../../constants/siteConfig';
import type { CodeItem } from '../../types/index';

import { $formatUtils } from './common.format';
import { session } from './storage-util';

type CodeMap = Record<string, Array<CodeItem>>;

interface CodeOption {
  visibleCode?: boolean;
  visibleName?: boolean;
}

interface CoreData {
  codeFormat?: string;
}

/** 세션에 적재된 전체 코드맵 */
const getCodeMap = (): CodeMap => session.get<CodeMap>(CONFIG.SESSION.CODE) ?? {};

/** 그룹 코드에 해당하는 코드 리스트 (동기) */
const getCodes = (code: string): Array<CodeItem> => getCodeMap()[code] ?? [];

/** 그룹 코드 내에서 codeField 로 항목 찾기 */
const findCode = (code: string, key: string): CodeItem | undefined =>
  getCodes(code).find((item) => item.codeField === key);

/**
 * 코드 리스트 가져오기
 * @param code 그룹 코드
 */
const getCodeList = (code = ''): Promise<Array<CodeItem>> => Promise.resolve(getCodes(code));

/**
 * 코드를 값으로 변환 처리 (코드+값 / 코드 / 값)
 * @param code 그룹 코드
 * @param key codeField
 * @param option 표시 옵션
 * @returns 변환된 라벨 (코드 없으면 받은 key 반환)
 */
const codeValue = (code: string, key: string, option?: CodeOption): string => {
  const codeItem = findCode(code, key);

  // 코드 없을 경우 받은 값 return
  if (!codeItem) {
    return key;
  }

  const visibleCode = option?.visibleCode ?? true;
  const visibleName = option?.visibleName ?? true;

  if (visibleCode && visibleName) {
    const coreData = session.get<CoreData>(CONFIG.SESSION.CORE_DATA);
    return $formatUtils.paramsFormat(coreData?.codeFormat ?? '', codeItem.codeField, codeItem.labelField);
  }

  if (visibleCode) {
    return codeItem.codeField;
  }

  if (visibleName) {
    return codeItem.labelField;
  }

  return '';
};

/**
 * 코드의 라벨을 비동기로 반환
 * @param code 그룹 코드
 * @param key codeField
 * @returns labelField (코드 없으면 받은 key 반환)
 */
const codeValue2 = (code: string, key: string): Promise<string> =>
  Promise.resolve(findCode(code, key)?.labelField ?? key);

/**
 * 그룹 코드의 codeField 목록 반환
 * @param code 그룹 코드
 */
const valueList = (code: string): Array<string> => getCodes(code).map((item) => item.codeField);

export const $codeUtils = {
  getCodeList,
  codeValue,
  codeValue2,
  valueList,
};
