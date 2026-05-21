import { useForm as useReactHookForm } from 'react-hook-form';

import { $validUtils } from '@/shared/lib/utils';

function useForm(settings: any) {
  const formName = settings?.formName;

  // 조회 Form
  const {
    handleSubmit,
    control,
    setValue: setValueOrg,
    getValues,
    reset,
    trigger,
    formState: { errors },
  } = useReactHookForm({
    mode: settings?.mode || 'onChange',
    shouldFocusError: false,
    defaultValues: settings?.defaultValues || {},
  });

  /**
   * setValue 재정의 : 값이 null or undefined 이 들어가는 경우 ""로 변환처리
   * @param key
   * @param value
   */
  const setValue = (key: string, value: any) => {
    const data = value ?? '';
    setValueOrg(key, data);
    // 값 변경시 유효성 확인해서 validMessage 노출여부 체크
    trigger(key);
  };

  /**
   * defaultValues key값 배열 return
   * @returns
   */
  const getKeys = () => {
    if (settings?.defaultValues) {
      return Object.keys(settings?.defaultValues);
    }

    return [];
  };

  /**
   * 유효성검증 전후로 마스킹 값 설정
   * 왜냐하면 유효성검증은 unmask 값으로 체크해야 하기 때문
   */
  const setValidMaskValue = function (maskFlag: string) {
    const inputEls = document.querySelectorAll(
      `.tab-panel.active [data-form='${formName}'] input`,
    );
    const fallbackEls = document.querySelectorAll(
      `[data-form='${formName}'] input`,
    );
    const elements = inputEls.length > 0 ? inputEls : fallbackEls;
    // console.log("elements :: ", elements)
    elements.forEach((inputEl) => {
      const input = inputEl as HTMLInputElement;
      // console.log("input?.dataset?.ismask :: ", input?.dataset?.ismask)
      // 마스킹이 적용되어 있는 input 만 검증
      if (input.dataset.ismask === 'true') {
        // console.log(
        //   "input?.dataset[maskFlag] :: ",
        //   input?.dataset[maskFlag],
        // )
        // input.value = input?.dataset[maskFlag]
        setValue(input.name, input.dataset[maskFlag]);
      }
    });
  };

  const validate = function () {
    return new Promise((resolve, reject) => {
      // 마스킹 데이터를 unmask 를 value 에 넣고 유효성 검증을 실시한다.
      // setValidMaskValue("unmask") // 검증 통과 후 다시 원복해야 한다.
      handleSubmit(
        (data: any, e: any) => {
          // setValidMaskValue("mask") // 원복 (다시 마스킹을 적용한다)
          // 정상인경우
          console.log('onSubmit :: ', data, e);
          // setValidMaskValue("mask")
          resolve(data); // unmask된 데이터 전달
        },
        (formErrors: any, e: any) => {
          // setValidMaskValue("mask") // 원복 (다시 마스킹을 적용한다)
          // reject()
          // 에러인경우
          console.log('onError', errors, e);
          const params = Object.keys(formErrors).map((key: string) => {
            const { type, message } = formErrors[key];

            let inputEl: HTMLInputElement | null;
            if (document.querySelector('.modal')) {
              inputEl = document.querySelector<HTMLInputElement>(
                `.modal [data-form='${formName}'] [data-hook-form-key='${key}']`,
              );
            } else {
              inputEl =
                document.querySelector<HTMLInputElement>(
                  `.tab-panel.active [data-form='${formName}'] [data-hook-form-key='${key}']`,
                ) ||
                document.querySelector<HTMLInputElement>(
                  `[data-form='${formName}'] [data-hook-form-key='${key}']`,
                );
            }

            if (!inputEl) {
              console.error(
                `유효성 검증 오류 : data-form(${formName})을 확인해 주시기 바랍니다.`,
              );
            }

            const datasetRule = inputEl?.dataset.rule;
            const ruleJSON = datasetRule ? JSON.parse(datasetRule) : {};
            const errorParam = {
              name: inputEl?.title,
              value: inputEl?.value,
              ...ruleJSON,
            };
            // 다국어 키로 변경
            const [title, contents] = $validUtils.getMessage(
              formErrors[key],
              errorParam,
            );
            return {
              type,
              message,
              key,
              title,
              contents,
              inputEl,
            };
          });
          console.log('validateForm params :: ', params);
          reject(params);
          // $modalHooks.valid(params).then((result: any) => {
          //   params[0].inputEl?.focus()
          //   console.log('vaild alert close!!')
          // })
        },
      )();
    });
  };

  return {
    handleSubmit,
    control,
    setValue,
    getKeys,
    getValues,
    reset,
    validate,
    errors,
  };
}

export default useForm;
