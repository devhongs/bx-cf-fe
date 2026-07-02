import { useRef } from 'react';
import { useForm, type DefaultValues, type UseFormReturn } from 'react-hook-form';

import { createFormResolver } from './form-rules';
import type { FormFieldConfig, FormValidate, FormValues } from './form.types';

interface UseZodFormOptions<TValues extends FormValues> {
  defaultValues: DefaultValues<TValues>;
  getFields: () => Array<FormFieldConfig<TValues>>;
  validate?: FormValidate<TValues>;
}

export const useZodForm = <TValues extends FormValues>({
  defaultValues,
  getFields,
  validate,
}: UseZodFormOptions<TValues>): UseFormReturn<TValues> => {
  const validateRef = useRef<FormValidate<TValues> | undefined>(validate);
  validateRef.current = validate;

  return useForm<TValues>({
    defaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldFocusError: true,
    resolver: createFormResolver(getFields, (values) => validateRef.current?.(values) ?? true),
  });
};
