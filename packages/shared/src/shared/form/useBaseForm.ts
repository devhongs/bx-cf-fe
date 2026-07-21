import { isEqual } from 'lodash-es';
import type { ReactElement } from 'react';
import { useEffect, useRef } from 'react';
import {
  type DefaultValues,
  type FieldValues,
  type UseFormProps,
  type UseFormReturn,
  useForm,
} from 'react-hook-form';

import { FormAccountInput, type FormAccountInputProps } from './FormAccountInput';
import { FormInput, type FormInputProps } from './FormInput';
import { FormSelect, type FormSelectProps } from './FormSelect';
import { FormTextarea, type FormTextareaProps } from './FormTextarea';

export type { FieldValues } from 'react-hook-form';
/** 배열 필드(코드 목록 등)를 다루는 화면이 RHF에 직접 의존하지 않도록 재노출한다. */
export { useFieldArray } from 'react-hook-form';

type FieldComponent<P> = (props: P) => ReactElement | null;

export interface UseBaseFormProps<TValues extends FieldValues>
  extends Omit<UseFormProps<TValues, unknown, TValues>, 'defaultValues'> {
  defaultValues: DefaultValues<TValues>;
  resetOnDefaultValuesChange?: boolean;
}

export interface UseBaseFormReturn<TValues extends FieldValues> {
  form: UseFormReturn<TValues, unknown, TValues>;
  resetToDefaultValues: () => void;
  /** 이 폼의 값 타입으로 고정된 필드 컴포넌트. name·validate 등이 타입 검사된다. */
  FormInput: FieldComponent<FormInputProps<TValues>>;
  FormSelect: FieldComponent<FormSelectProps<TValues>>;
  FormTextarea: FieldComponent<FormTextareaProps<TValues>>;
  FormAccountInput: FieldComponent<FormAccountInputProps<TValues>>;
}

/**
 * 앱 공통 폼 로직. 스타일은 모른다 — 앱별 `useAppForm`이 이 위에 기본값을 얹는다.
 *
 * 반환하는 `Input`/`Select`/… 는 `FormInput` 등을 이 폼의 값 타입으로 좁힌 **같은 참조**다.
 * (타입 캐스트일 뿐 새 컴포넌트가 아니라서 리렌더 시 remount 되지 않는다.)
 * 스타일은 여전히 필드 prop 또는 `Form`에서 처리한다.
 */
export function useBaseForm<TValues extends FieldValues>({
  defaultValues,
  resetOnDefaultValuesChange = false,
  ...props
}: UseBaseFormProps<TValues>): UseBaseFormReturn<TValues> {
  const form = useForm<TValues, unknown, TValues>({
    ...props,
    defaultValues,
  });
  const { reset } = form;
  const previousDefaultValuesRef = useRef(defaultValues);

  const resetToDefaultValues = () => {
    reset(defaultValues);
  };

  useEffect(() => {
    if (!resetOnDefaultValuesChange) {
      previousDefaultValuesRef.current = defaultValues;
      return;
    }

    if (isEqual(previousDefaultValuesRef.current, defaultValues)) return;

    previousDefaultValuesRef.current = defaultValues;
    reset(defaultValues);
  }, [defaultValues, reset, resetOnDefaultValuesChange]);

  return {
    form,
    resetToDefaultValues,
    FormInput: FormInput as unknown as FieldComponent<FormInputProps<TValues>>,
    FormSelect: FormSelect as unknown as FieldComponent<FormSelectProps<TValues>>,
    FormTextarea: FormTextarea as unknown as FieldComponent<FormTextareaProps<TValues>>,
    FormAccountInput: FormAccountInput as unknown as FieldComponent<FormAccountInputProps<TValues>>,
  };
}
