import { createContext, useContext } from 'react';

/**
 * 필드 컴포넌트가 Form에서 상속받는 스타일 기본값.
 * 각 필드 prop이 있으면 그것이 우선하고, 없으면 이 값을 쓴다.
 */
export interface FormFieldStyle {
  /** 컨트롤(input/select/textarea)에 붙는 className */
  controlClassName?: string;
  /** 필드 래퍼 div className */
  fieldClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  errorClassName?: string;
}

const FormFieldStyleContext = createContext<FormFieldStyle>({});

export const FormFieldStyleProvider = FormFieldStyleContext.Provider;

export const useFormFieldStyle = () => useContext(FormFieldStyleContext);
