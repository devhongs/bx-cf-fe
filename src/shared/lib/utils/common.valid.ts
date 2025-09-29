import { $formatUtils, $i18nUtils } from '@/shared/lib/utils'

type ValidCondition = {
  condition: boolean // test 조건
  message: string // 에러메세지
}

/**
 * 검증 후 에러 메세지를 출력한다.
 * @returns
 */
const validateMessage = (condition: ValidCondition) =>
  condition.condition ? condition.message : null

/**
 * 유효성 검증 메세지를 출력한다.
 * @param error
 * @param param
 * @returns
 */
const getMessage = (error: any, param?: any) => {
  const { type } = error
  let title = ''
  let contents = ''
  if (type === 'required') {
    const { name } = param
    title = $i18nUtils.trans(`K009#validRequired`) // '필수'
    contents = $i18nUtils.trans('K001#M000000025', { 0: name }) // '필수 입력 항목입니다. 입력 값을 확인하십시요.',
  } else if (type === 'minLength') {
    const { name } = param
    title = $i18nUtils.trans(`K009#validMinLength`) // '최소값'
    contents = $i18nUtils.trans('K001#M000000026', {
      0: name,
      1: param.minLength.value,
      2: (param.value || '').length,
    }) // [항목명] 5자리 이하로 입력해주세요. (현재 6자리)
  } else if (type === 'maxLength') {
    const { name } = param
    title = $i18nUtils.trans(`K009#validMaxLength`) // '최대값'
    contents = $i18nUtils.trans('K001#M000000027', {
      0: name,
      1: param.maxLength.value,
      2: (param.value || '').length,
    }) // [항목명] 5자리 이하로 입력해주세요. (현재 6자리)
  } else if (type === 'min') {
    const { name } = param
    title = $i18nUtils.trans(`K009#validNumeric`) // '숫자 최소값 오류',
    contents = $i18nUtils.trans('K001#M000000028', {
      0: name,
      1: param.value,
    }) // [항목명] 입력된 값 (-111), 입력 가능한 최소 값 (-100)
  } else if (type === 'max') {
    const { name } = param
    title = $i18nUtils.trans(`K009#validNumeric`) // '숫자 최대값 오류',
    contents = $i18nUtils.trans('K001#M000000028', {
      0: name,
      1: param.value,
    }) // [항목명] 입력된 값 (111), 입력 가능한 최대 값 (100)
  } else if (type === 'pattern' || type === 'validItem') {
    title = $i18nUtils.trans(`K009#validItem`) // '유효성',
    contents = error.message
  } else if (type === 'positive') {
    title = '양수' // '유효성',
    contents = error.message
  } else if (type === 'validDate') {
    const { name, value } = param
    title = $i18nUtils.trans(`K009#validDate`) // '날짜 유효성',
    contents = $i18nUtils.trans('MSG#validDate', {
      0: name,
      1: value.replace(/[^0-9]/g, ''),
    }) // [항목명] (2023-11-99) 은/는 유효하지 않은 날짜입니다.
  } else if (type === 'minDate') {
    const { name, minDate, value } = param
    title = $i18nUtils.trans(`K009#minDate`) // '최소 일자',
    contents = $i18nUtils.trans('MSG#minDate', {
      0: name,
      1: $formatUtils.dateFormat(minDate),
      2: value,
    }) // [항목명] (2023-11-15) 보다 이후 날짜로 입력해주세요.
  } else if (type === 'maxDate') {
    const { name, maxDate, value } = param
    title = $i18nUtils.trans(`K009#maxDate`) // '최대 일자',
    contents = $i18nUtils.trans('MSG#maxDate', {
      0: name,
      1: $formatUtils.dateFormat(maxDate),
      2: value,
    }) // [항목명] (2023-11-15) 보다 이전 날짜로 입력해주세요.
  } else if (type === 'validMonth') {
    const { name, value } = param
    title = $i18nUtils.trans(`K009#validMonth`) // '월 유효성',
    contents = $i18nUtils.trans('MSG#validMonth', {
      0: name,
      1: value.replace(/[^0-9]/g, ''),
    }) // [항목명] (2023-11-99) 은/는 유효하지 않은 날짜입니다.
  } else if (type === 'minMonth') {
    const { name, minMonth, value } = param
    title = $i18nUtils.trans(`K009#minMonth`) // '최소 월',
    contents = $i18nUtils.trans('MSG#minMonth', {
      0: name,
      1: $formatUtils.dateFormat(minMonth),
      2: value,
    }) // [항목명] (2023-11-15) 보다 이후 날짜로 입력해주세요.
  } else if (type === 'maxMonth') {
    const { name, maxMonth, value } = param
    title = $i18nUtils.trans(`K009#maxMonth`) // '최대 월',
    contents = $i18nUtils.trans('MSG#maxMonth', {
      0: name,
      1: $formatUtils.dateFormat(maxMonth),
      2: value,
    }) // [항목명] (2023-11-15) 보다 이전 날짜로 입력해주세요.
  } else if (type === 'validYear') {
    const { name, value } = param
    title = $i18nUtils.trans(`K009#validYear`) // '년도 유효성',
    contents = $i18nUtils.trans('MSG#validYear', {
      0: name,
      1: value.replace(/[^0-9]/g, ''),
    }) // [항목명] (2023-11-99) 은/는 유효하지 않은 날짜입니다.
  } else if (type === 'minYear') {
    const { name, minYear, value } = param
    title = $i18nUtils.trans(`K009#minYear`) // '최소 년도',
    contents = $i18nUtils.trans('MSG#minYear', {
      0: name,
      1: $formatUtils.dateFormat(minYear),
      2: value,
    }) // [항목명] (2023-11-15) 보다 이후 날짜로 입력해주세요.
  } else if (type === 'maxYear') {
    const { name, maxYear, value } = param
    title = $i18nUtils.trans(`K009#maxYear`) // '최대 년도',
    contents = $i18nUtils.trans('MSG#maxYear', {
      0: name,
      1: $formatUtils.dateFormat(maxYear),
      2: value,
    }) // [항목명] (2023-11-15) 보다 이전 날짜로 입력해주세요.
  } else if (type === 'excludeList') {
    const { name, excludeList, value } = param
    title = $i18nUtils.trans(`K009#excludeList`) // '제외',
    contents = $i18nUtils.trans('MSG#excludeList', {
      0: name,
      1: value,
      2: excludeList,
    }) // [항목명] (1) 제외하고 입력해 주시기 바랍니다. (대상: 2)
  }

  return [title, contents]
}

export const $validUtils = {
  validateMessage,
  getMessage,
}
