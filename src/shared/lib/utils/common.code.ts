import CONFIG from '@/shared/constants/siteConfig'
import type { CodeItem } from '@/shared/types/index'

import { $formatUtils } from './common.format'
import { $storageUtils } from './common.storage'

interface CodeOption {
  visibleCode?: boolean
  visibleName?: boolean
}

/**
 * 코드 가져오기
 * @param {string} code
 */
const getCodeList = (code = ''): Promise<Array<CodeItem>> =>
  new Promise((resolve) => {
    const codeItems = $storageUtils.session(CONFIG.SESSION.CODE)

    if (!codeItems) {
      resolve([])
    }

    const codeInfo = codeItems[code]
    // console.log("getCodeList codeInfo :: ", codeInfo)

    // 세션 확인
    if (codeInfo) {
      resolve(codeInfo)
    } else if (typeof window !== 'undefined') {
      resolve([])
    }
  })

/**
 * 코드를 값으로 변환 처리 (코드+값 / 코드 / 값)
 * @param code : 코드
 * @param key : 키
 * @param option : 옵션
 * @returns : 변환된 라벨
 */
const codeValue = (code: string, key: string, option?: CodeOption) => {
  const codeItems = $storageUtils.session(CONFIG.SESSION.CODE)

  if (!codeItems) {
    return key
  }

  const codeInfo = codeItems[code] || []
  const codeItem = codeInfo.find((item: any) => item.codeField === key) || {}

  // 코드 없을 경우 받은 값 return
  if (Object.keys(codeItem).length === 0) {
    return key
  }

  const settings: CodeOption = {
    visibleCode: option?.visibleCode ?? true,
    visibleName: option?.visibleName ?? true,
  }

  let result = ''

  if (settings.visibleCode && settings.visibleName) {
    const coreData = $storageUtils.getSessionCoreData()
    result = $formatUtils.paramsFormat(
      coreData.codeFormat,
      codeItem.codeField,
      codeItem.labelField,
    )
  } else if (settings.visibleCode) {
    result = codeItem.codeField
  } else if (settings.visibleName) {
    result = codeItem.labelField
  }

  return result
}

const codeValue2 = async (code: string, key: string) =>
  new Promise((resolve) => {
    getCodeList(code).then((codeList: any) => {
      const item = codeList.find((d: any) => d.codeField === key)
      resolve(item.labelField)
    })
  })

const valueList = (code: string) => {
  const codeItems = $storageUtils.session(CONFIG.SESSION.CODE)
  const codeInfo = codeItems[code]
  return codeInfo.map((item: any) => item.codeField)
}

export const $codeUtils = {
  getCodeList,
  codeValue,
  codeValue2,
  valueList,
}
