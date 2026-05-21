import CONFIG from '@/shared/constants/siteConfig';
import type { CodeItem } from '@/shared/types/index';

import { $formatUtils } from './common.format';
import { session } from './storage-util';

type CodeMap = Record<string, Array<CodeItem>>;

interface CodeOption {
  visibleCode?: boolean;
  visibleName?: boolean;
}

/**
 * 코드 가져오기
 * @param {string} code
 */
const getCodeList = (code = ''): Promise<Array<CodeItem>> =>
  new Promise((resolve) => {
    const codeItems = session.get<Record<string, Array<CodeItem>>>(
      CONFIG.SESSION.CODE,
    );

    if (!codeItems) {
      resolve([]);
      return;
    }

    const codeInfo = codeItems[code] ?? [];
    // console.log("getCodeList codeInfo :: ", codeInfo)

    resolve(codeInfo);
  });

/**
 * 코드를 값으로 변환 처리 (코드+값 / 코드 / 값)
 * @param code : 코드
 * @param key : 키
 * @param option : 옵션
 * @returns : 변환된 라벨
 */
const codeValue = (code: string, key: string, option?: CodeOption) => {
  const codeItems = session.get<CodeMap>(CONFIG.SESSION.CODE);

  if (!codeItems) {
    return key;
  }

  const codeInfo = codeItems[code] ?? [];
  const codeItem = codeInfo.find((item) => item.codeField === key);

  // 코드 없을 경우 받은 값 return
  if (!codeItem) {
    return key;
  }

  const settings: CodeOption = {
    visibleCode: option?.visibleCode ?? true,
    visibleName: option?.visibleName ?? true,
  };

  let result = '';

  if (settings.visibleCode && settings.visibleName) {
    const coreData = session.get<any>(CONFIG.SESSION.CORE_DATA);
    result = $formatUtils.paramsFormat(
      coreData?.codeFormat,
      codeItem.codeField,
      codeItem.labelField,
    );
  } else if (settings.visibleCode) {
    result = codeItem.codeField;
  } else if (settings.visibleName) {
    result = codeItem.labelField;
  }

  return result;
};

const codeValue2 = async (code: string, key: string) =>
  new Promise((resolve) => {
    getCodeList(code).then((codeList: any) => {
      const item = codeList.find((d: any) => d.codeField === key);
      resolve(item.labelField);
    });
  });

const valueList = (code: string) => {
  const codeItems = session.get<CodeMap>(CONFIG.SESSION.CODE);
  if (!codeItems) return [];

  const codeInfo = codeItems[code] ?? [];
  return codeInfo.map((item) => item.codeField);
};

export const $codeUtils = {
  getCodeList,
  codeValue,
  codeValue2,
  valueList,
};
